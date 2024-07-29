export const base_url = 'http://localhost:3000';

export function hideModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    modal.classList.remove('is-active');
  });
}

//! BONUS COULEUR

export const componentToHex = (c) => {
  // https://learnersbucket.com/examples/interview/convert-rgb-to-hex-color-in-javascript/
  //* Hexadecimal utilise 16 symboles
  //* convertir la couleur dans le rgb en hex => converti le nombre en base 16 qui est celle de hex
  const hex = c.toString(16);
  //* hex doit avoir 2 digits, si renvoie un seul alors je lui mets 0 devant (08 ou 0e)
  return hex.length == 1 ? '0' + hex : hex;
};
export const rgbToHex = (rgb) => {
  //* str sera par ex: rgb(255, 55, 3)
  const colorsRaw = rgb.split(','); // ['rgb(255', ' 55', ' 3)']
  let r = Number(colorsRaw[0].replace('rgb(', '')); // 255
  let g = Number(colorsRaw[1].trim()); // 55
  let b = Number(colorsRaw[2].trim().replace(')', '')); // 3
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b); // #e66465
};
