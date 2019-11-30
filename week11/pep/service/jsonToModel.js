
export { toDeveloper }

const toDeveloper = imagePath => (jsonDev, idx) => (
    {
        id:   idx, // todo: use proper domain index
        img:  imagePath + (jsonDev.imageUrl || "imgno.jpg"),
        name: jsonDev.firstName + " " + jsonDev.lastName
    }
);
