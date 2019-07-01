
const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);
console.log(moduleNameMapper)
module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json",
            diagnostics: true
        },
        NODE_ENV: "test"
    },
    "rootDir": ".",
    moduleDirectories: ["node_modules", 'src'],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testMatch": [
        "<rootDir>/**/?(*.)(spec|test).(ts|js)?(x)"
    ],
    verbose: true,
    "moduleNameMapper": {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^test/(.*)$": "<rootDir>/test/$1",
        "^utils/(.*)$": "<rootDir>/src/utils/$1",
        "^action_types$": "<rootDir>/src/action_types",
        "^constants$": "<rootDir>/src/constants",
        "^action_types/(.*)$": "<rootDir>/src/action_types/$1"
    },
};