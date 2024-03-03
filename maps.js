const dist = document.querySelector("#distance");
const form = document.querySelector("#addressForm");
const latitud = document.querySelector("#latitud");
const longitud = document.querySelector("#longitud");
let map = null;
let destPoint;
let lat, lon;

navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  createMap(lat, lon);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const addressInput = document.querySelector("#address").value;
  const encodedAddress = encodeURIComponent(addressInput).replace(/%20/g, "+");

  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ocurrió un error al obtener la respuesta.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const information = data[0];
        lat = information.lat;
        lon = information.lon;
        createMap(lat, lon);
      } else {
        console.error(
          "No se encontraron resultados para la dirección proporcionada."
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

function createMap(lat, lon) {
  if (map) {
    map.remove();
  }
  map = L.map("my_map").setView([lat, lon], 18);
  latitud.textContent = lat;
  longitud.textContent = lon;
  dist.textContent = "0 m.";

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let myIcon = L.icon({
    iconUrl: "my-icon.png",
    iconSize: [50, 50],
  });

  const homePoint = L.marker([lat, lon], { icon: myIcon }).addTo(map);

  const createDestPoint = (e) => {
    if (destPoint) {
      map.removeLayer(destPoint);
    }
    destPoint = L.marker(e.latlng, { draggable: true }).addTo(map);
    updateDistance();

    destPoint.on("dragend", updateDistance);

    function updateDistance() {
      let distance = map.distance(homePoint.getLatLng(), destPoint.getLatLng());
      let unitMesasure = "m";
      if (distance > 1000) {
        distance = distance / 1000;
        unitMesasure = "km";
      }
      dist.textContent = `${distance.toFixed(1)} ${unitMesasure}.`;
    }
  };
  map.on("click", createDestPoint);
}
