const dist = document.querySelector("#distance");
const form = document.querySelector("#addressForm");
const latitud = document.querySelector("#latitud");
const longitud = document.querySelector("#longitud");
let map = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const addressInput = document.querySelector("#address").value;
  const encodedAddress = encodeURIComponent(addressInput).replace(/%20/g, "+");

  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json`;

  let lat, lon;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ocurrió un error al obtener la respuesta.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const firstResult = data[0];
        console.log("Latitud:", firstResult.lat);
        console.log("Longitud:", firstResult.lon);
        lat = firstResult.lat;
        lon = firstResult.lon;
        createMap(lat, lon);
      } else {
        console.log(
          "No se encontraron resultados para la dirección proporcionada."
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  createMap(lat, lon);
});

function createMap(lat, lon) {
  if (map) {
    map.remove();
  }
  map = L.map("my_map").setView([lat, lon], 18);
  latitud.textContent = lat;
  longitud.textContent = lon;
  dist.textContent = "0 m."


  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const refPoint = L.marker([lat, lon]).addTo(map);
  let destPoint;

  function onMapClick(e) {
    if (destPoint) {
      map.removeLayer(destPoint);
    }
    destPoint = L.marker(e.latlng).addTo(map);
    let distance = map.distance(refPoint.getLatLng(), destPoint.getLatLng());
    let unitMesasure = "m";
    if (distance > 1000) {
      distance = distance / 1000;
      unitMesasure = "km";
    }
    dist.textContent = `${distance.toFixed(1)} ${unitMesasure}.`;
  }
  map.on("click", onMapClick);
}
