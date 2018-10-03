const listCategory = [
  { name: "jeux" },
  { name: "cinema" },
  { name: "horreur" },
  { name: "humour" }
];

export const createCategory = async category => {
  await category.bulkCreate(listCategory);
};
