import provinces from "china-division/dist/provinces.json";
import cities from "china-division/dist/cities.json";
import areas from "china-division/dist/areas.json";
import pccode from "china-division/dist/pc-code.json";
import pcacode from "china-division/dist/pca-code.json";
import pcascode from "china-division/dist/pcas-code.json";

const provincesCopy = JSON.parse(JSON.stringify(provinces));
const citiesCopy = JSON.parse(JSON.stringify(cities));
const areasCopy = JSON.parse(JSON.stringify(areas));

areasCopy.forEach(area => {
  const matchCity = citiesCopy.filter(city => city.code === area.cityCode)[0];

  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      name: area.name,
      code: area.code
    });
  }
});

citiesCopy.forEach(city => {
  const matchProvince = provincesCopy.filter(
    province => province.code === city.provinceCode
  )[0];

  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      name: city.name,
      code: city.code,
      children: city.children
    });
  }
});

export const division = provincesCopy.map(province => ({
  name: province.name,
  code: province.code,
  children: province.children
}));
export const divisionTwo = pccode;
export const divisionThree = pcacode;
export const divisionFour = pcascode;

export function filterDivision(value = [], dataSource = []) {
  let options = [ ...dataSource ];
  function filter(target, data) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (target === element.code || target === element.name) {
        options = element.children;
        return [element, data];
      }
    }
  }
  return value.reduce((acc, cur) => {
    const [selected, selectedOptions] = filter(cur, options);
    acc.selected.push(selected);
    acc.selectedOptions.push(selectedOptions);
    return acc;
  }, {selected: [], selectedOptions: []});
}
