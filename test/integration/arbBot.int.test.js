const hre = require("hardhat")
// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")
const { expect } = require("chai")

// const { dualArbScan } = require("../../src/dualArbScan")
const { arbQuote } = require("../../src/utils/arbQuote")
const { poolInformation } = require("../../src/utils/poolInformation")
const { initPools } = require("../../src/utils/InitPools")
const { findArbitrageRoutes } = require("../../src/utils/findArbitrageRoutes")
const { initFlashSwap } = require("../../src/utils/initFlashSwap")
const { getProvider } = require("../../src/utils/getProvider")

const { data: poolsData } = require("../../src/jsonPoolData/uniswapPools.json")
const artifacts = {
    UniswapV3Router: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
}
const {
    abi: flashSwapAbi,
} = require("../../ignition/deployments/chain-31337/artifacts/FlashSwapV3#FlashSwapV3.json")

const {
    abi: PoolAbi,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json")
const { weth9Abi, UsdcAbi } = require("../mainnetTokens.json")

const pools = poolsData.pools
const amountInUsd = "100"

WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

const UNISWAP_V3_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
const FLASHSWAP_ADDRESS = "0x725314746e727f586e9fca65aed5dbe45aa71b99"

let deployer
let weth,
    usdc,
    wethAmount,
    flashSwapContract,
    uniswapV3Router,
    whale,
    whaleSigner,
    poolsArray,
    routesArray,
    tokenAmountsIn

describe("DualArbBot Tests", function () {
    it("runs tests", async function () {
        // create arb opportunity by swapping weth for usdc
        ;[deployer] = await hre.ethers.getSigners()

        // Get the FlashSwap contract
        // flashSwapContract = initFlashSwap()

        const provider = getProvider()

        flashSwapContract = new hre.ethers.Contract(
            FLASHSWAP_ADDRESS,
            flashSwapAbi,
            provider,
        )

        // Get the WETH and USDC contracts
        weth = new hre.ethers.Contract(WETH_ADDRESS, weth9Abi, deployer)
        usdc = new hre.ethers.Contract(USDC_ADDRESS, UsdcAbi, deployer)

        // Initialize the pools
        poolsArray = await initPools(pools)
        console.log(`Found ${poolsArray.length} pools`)

        // Output pool information and token amounts in for each token included in query.
        tokenAmountsIn = await poolInformation(pools, amountInUsd)

        // Impersonate a whale account
        whale = "0x6B44ba0a126a2A1a8aa6cD1AdeeD002e141Bcd44" // Replace with a WETH or USDC whale address
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [whale],
        })

        whaleSigner = await hre.ethers.getSigner(whale)

        const whaleWethBalance = await weth.balanceOf(whale)

        const whaleUsdcBalance = await usdc.balanceOf(whale)

        console.log(
            "Initial whale WETH balance:",
            hre.ethers.formatEther(whaleWethBalance.toString()),
        )
        console.log(
            "Initial whale USDC balance:",
            hre.ethers.formatUnits(whaleUsdcBalance.toString(), 6),
        )

        // Transfer WETH from whale to deployer
        wethAmount = hre.ethers.parseEther("500")

        // Get the Uniswap V3 Router contract
        uniswapV3Router = new hre.ethers.Contract(
            UNISWAP_V3_ROUTER_ADDRESS,
            artifacts.UniswapV3Router.abi,
            deployer,
        )

        // Approve the router to spend WETH
        await weth
            .connect(whaleSigner)
            .approve(UNISWAP_V3_ROUTER_ADDRESS, wethAmount)

        const params = {
            tokenIn: WETH_ADDRESS,
            tokenOut: USDC_ADDRESS,
            fee: 3000,
            recipient: whaleSigner.address,
            deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
            amountIn: wethAmount,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0,
            // gasLimit: ethers.utils.hexlify(1000000), // Set a high gas limit
            maxFeePerGas: 9470890005, // Set max fee per gas
            maxPriorityFeePerGas: 3000000000, // Set priority fee
        }

        try {
            console.log(
                "Executing swap - 500 WETH for USDC to create arb opportunity...",
            )
            const tx = await uniswapV3Router
                .connect(whaleSigner)
                .exactInputSingle(params)

            await tx.wait()
            console.log("Swap executed successfully")
        } catch (error) {
            console.error("Error executing exactInputSingle:", error)
        }

        // Verify balances
        const newWhaleWethBalance = await weth.balanceOf(whaleSigner.address)
        const newWhaleUsdcBalance = await usdc.balanceOf(whaleSigner.address)
        console.log("--------------------")
        console.log(
            "New Whale WETH balance:",
            hre.ethers.formatEther(newWhaleWethBalance.toString()),
        )
        console.log(
            "New Whale USDC balance:",
            hre.ethers.formatUnits(newWhaleUsdcBalance.toString(), 6),
        )

        // Get possible arbitrage routes where tokenIn and tokenOut are the same.
        routesArray = await findArbitrageRoutes(
            pools,
            tokenAmountsIn,
            amountInUsd,
        )

        console.log("token amounts in: ", tokenAmountsIn)
        console.log("amount in usd: ", amountInUsd)

        let route
        for (let i = 0; i < routesArray.length; i++) {
            if (
                routesArray[i][0] === WETH_ADDRESS &&
                routesArray[i][1] === "3000" &&
                routesArray[i][2] === USDC_ADDRESS &&
                routesArray[i][3] === "500"
            ) {
                route = routesArray[i]
            }
        }
        // console.log("test route: ", route)

        const amountInFromArray = route[7]
        const routeNumber = 0
        const profitThreshold = route[8]

        console.log("Calling Flashswap...")

        poolAddress = ethers.getAddress(route[10])
        feePool1 = route[3]
        tokenIn = route[0]
        tokenOut = route[2]
        token0Decimals = Number(route[5])

        try {
            // Call flashswap
            const tx = await flashSwapContract.connect(deployer).flashSwap(
                poolAddress,
                feePool1,
                tokenIn,
                tokenOut,
                hre.ethers.parseUnits(amountInUsd, 6), // Make sure any amountIn inputs are formatted like this.
                0,
            )

            // Log the smart contract profit of each token
            const wethProfit = hre.ethers.formatUnits(
                await flashSwapContract.connect(deployer).getWethProfit(),
                18,
            )
            const usdcProfit = hre.ethers.formatUnits(
                await flashSwapContract.connect(deployer).getUsdcProfit(),
                6,
            )
            const usdtProfit = hre.ethers.formatUnits(
                await flashSwapContract.connect(deployer).getUsdtProfit(),
                6,
            )

            console.log(`Route ${routeNumber} Info:`)
            console.log(`amountIn - ${amountInUsd} ${route[9]}`)

            console.log(
                `Path - ${route[0]} -> ${route[1]} -> ${route[2]} -> ${route[3]} -> ${route[4]}`,
            )
            console.log("-----------------------")
            console.log("")
            console.log("Total Smart Contract Profits:")
            console.log(`WETH Profit: ${wethProfit}`)
            console.log(`USDC Profit: ${usdcProfit}`)
            console.log(`USDT Profit: ${usdtProfit}`)
            console.log("")
            console.log("-----------------------")

            // Get transaction receipt
            const txReceipt = await tx.wait()
            console.log("Transaction Receipt: ", txReceipt)
        } catch (error) {
            console.error("Error executing flashswap:", error)
        }

        const deployerUsdcBalance = await usdc.balanceOf(deployer.address)

        expect(deployerUsdcBalance).to.be.greaterThan(0)

        console.log(
            "Deployer Weth balance after Arb",
            await weth.balanceOf(deployer.address),
        )
        console.log(
            "Deployer Usdc balance after Arb",
            await usdc.balanceOf(deployer.address),
        )
    })
})
