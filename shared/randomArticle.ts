let result = '';
let title = '';
const charaters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
const charatersLength = 250;
const titlelength = 20;

for (let i = 0; i < charatersLength; i++) {
  result += charaters.charAt(Math.floor(Math.random() * charatersLength));
}
for (let i = 0; i < titlelength; i++) {
  title += charaters.charAt(Math.floor(Math.random() * titlelength));
}

export const article = { title, result };
export default { title, result };
