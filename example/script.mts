// npm start run example/script.mts

export async function message() {
  return 'hello from esm module'
}

console.log(await message())
