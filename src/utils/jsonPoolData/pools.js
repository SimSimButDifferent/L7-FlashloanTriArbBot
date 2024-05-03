// function pools() {
const pools = [
    {
        id: "0x3416cf6c708da44db2624d63ea0aaef7113527c6",
        feeTier: "100",
        liquidity: "104680064645670991",
        token0: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
        token1: {
            id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether USD",
            decimals: "6",
        },
    },
    {
        id: "0x4773e2c1c0b400a16dfec4ca6e305141859a5542",
        feeTier: "3000",
        liquidity: "4427506403099635",
        token0: {
            id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            symbol: "DAI",
            name: "Dai Stablecoin",
            decimals: "18",
        },
        token1: {
            id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether USD",
            decimals: "6",
        },
    },
    {
        id: "0x48da0965ab2d2cbf1c17c09cfb5cbe67ad5b1406",
        feeTier: "100",
        liquidity: "2965300578680461213450",
        token0: {
            id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            symbol: "DAI",
            name: "Dai Stablecoin",
            decimals: "18",
        },
        token1: {
            id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether USD",
            decimals: "6",
        },
    },
    {
        id: "0x5777d92f208679db4b9778590fa3cab3ac9e2168",
        feeTier: "100",
        liquidity: "365330118902728002952528",
        token0: {
            id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            symbol: "DAI",
            name: "Dai Stablecoin",
            decimals: "18",
        },
        token1: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
    },
    {
        id: "0x6958686b6348c3d6d5f2dca3106a5c09c156873a",
        feeTier: "10000",
        liquidity: "163620348564489",
        token0: {
            id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            symbol: "DAI",
            name: "Dai Stablecoin",
            decimals: "18",
        },
        token1: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
    },
    {
        id: "0x6c6bc977e13df9b0de53b251522280bb72383700",
        feeTier: "500",
        liquidity: "22921110794776851966831",
        token0: {
            id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            symbol: "DAI",
            name: "Dai Stablecoin",
            decimals: "18",
        },
        token1: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
    },
    {
        id: "0x6f48eca74b38d2936b02ab603ff4e36a6c0e3a77",
        feeTier: "500",
        liquidity: "247110455939308026272",
        token0: {
            id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            symbol: "DAI",
            name: "Dai Stablecoin",
            decimals: "18",
        },
        token1: {
            id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether USD",
            decimals: "6",
        },
    },
    {
        id: "0x7858e59e0c01ea06df3af3d20ac7b0003275d4bf",
        feeTier: "500",
        liquidity: "2686504570411413",
        token0: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
        token1: {
            id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether USD",
            decimals: "6",
        },
    },
    {
        id: "0xa63b490aa077f541c9d64bfc1cc0db2a752157b5",
        feeTier: "3000",
        liquidity: "3820346049558076",
        token0: {
            id: "0x6b175474e89094c44da98b954eedeac495271d0f",
            symbol: "DAI",
            name: "Dai Stablecoin",
            decimals: "18",
        },
        token1: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
    },
    {
        id: "0xbb256c2f1b677e27118b0345fd2b3894d2e6d487",
        feeTier: "10000",
        liquidity: "11933971584",
        token0: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
        token1: {
            id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether USD",
            decimals: "6",
        },
    },
    {
        id: "0xee4cf3b78a74affa38c6a926282bcd8b5952818d",
        feeTier: "3000",
        liquidity: "1922257962926",
        token0: {
            id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: "6",
        },
        token1: {
            id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether USD",
            decimals: "6",
        },
    },
]

//     return pools
// }

exports.pools = pools
// Path: uniswapV3/uniswapV3foundry/src/utils/retrievePoolInfoUni.js
