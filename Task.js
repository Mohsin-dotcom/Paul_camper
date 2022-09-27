import fetch from "node-fetch";

let API_URL = 'https://paulcamper.de/api/inventory/search?center_lat=52.504043&center_lng=13.393236&page_size=24';
let requestOptions = {
  method: 'GET',
}

const getCampersList = async () => {
  try {
    return await fetch(API_URL, requestOptions)
      .then((res) => res.json());
  } catch (err) {
    console.log('error', err)
  }
}

const sortCampersByASC = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

const groupCampersByCategory = (sortedData) => sortedData.reduce((group, key) => {
    const { CampterType } = key;
    group[CampterType] = group[CampterType] ?? [];
    group[CampterType].push(key);
    return group;
  }, {});


const renderCampers = async () => {
  let campersList = await getCampersList();
  let campersData = campersList.Data.map((camper) => ({
    'name': camper.Profile.Name,
    'CampterType': camper.Profile.CamperType,
  }))

  //sorting by name (ASC)
  let sortedData = campersData.sort(sortCampersByASC);

  //group campers by category
  let groupByCategory = groupCampersByCategory(sortedData);

  //output the data in console in the required format.
  for (const key in groupByCategory) {
    console.log(`${key}: ${groupByCategory[key].map(item => item.name).toString()}`)
  }
}

//START
renderCampers();