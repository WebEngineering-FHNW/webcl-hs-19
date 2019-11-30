
export { pepServices }

const devs = [
    {id:0, img:"img/img0.jpg", name: "Marie-Claude Federspiel"},
    {id:1, img:"img/img1.jpg", name: "Christian Ribeaud"},
];

const pepServices = () => {

    const loadDevelopers = withDevelopers => withDevelopers(devs);
    return { loadDevelopers }
};
