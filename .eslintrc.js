module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    semi: "off", // memperbolehkan ;(titik koma) tanpa ada di dalam function
    radix: "off", // memperbolehkan fungsi parseInt tanpa harus menggunakan argumen/parameter ke 2
    "func-names": "off", // memperbolehkan pembuatan function bsa menggunakan annon function jdi diperbolehkan tanpa memberi nama
    "no-console": "off", // memperbolehkan console.log
    "no-shadow": "off", // penamaan variabel tidak dibatasi
    "no-unused-vars": [
      "error",
      {
        args: "none",
      },
    ], // tidak ada pengecekan argumen
    "consistent-return": "off", // membebaskan pengembalian dari fungsi
    "no-underscore-dangle": "off", // memperbolehkan underscore di variable
    "import/no-unresolved": "off", // memperbolehkan require data tanpa harus menggunakan ./
    "no-unused-expressions": { allowShortCircuit: true, allowTernary: true }, // memperbolehkan ternary operator
  },
};
