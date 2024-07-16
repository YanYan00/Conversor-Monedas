let data;
let myChart;
async function obtenerMonedas() {
    try {
        const res = await fetch("https://mindicador.cl/api");
        data = await res.json();
    } catch (error) {
        document.querySelector("#error").innerHTML = "¡Algo salió mal! Error: Failed to fetch";
    }
}
const conversorMonedas = function() {
    const cantidad = document.querySelector('#cantidad').value;
    const moneda = document.querySelector('#moneda').value;
    const conversion = cantidad / data[moneda].valor;
    document.querySelector('#resultado').textContent = `Resultado: $${conversion.toFixed(2)}`;
    renderGrafica();
}
async function crearGrafico() {
    try {
        let moneda = document.querySelector('#moneda').value;
        let apiUrl = `https://mindicador.cl/api/${moneda}/2024`;
        const res = await fetch(apiUrl);
        const historial = await res.json();
        let ultimosDias = [];
        for (let i = 0; i < 10; i++) {
            ultimosDias.unshift(historial.serie[i]);
        }
        let labels = ultimosDias.map((datos) => {
            return datos.fecha.split("T")[0].split('-').reverse().join('-');
        });
        let valores = ultimosDias.map((datos) => {
            return datos.valor;
        });
        const datasets = [{
            label: "Historial 10 dias",
            borderColor: "rgb(255,99,132)",
            data: valores,
        }];
        return {labels,datasets};
    }
    catch (error) {
        document.querySelector("#error").innerHTML = "¡Algo salió mal! Error: Failed to fetch";
    }
}
async function renderGrafica() {
    const data = await crearGrafico();
    if (myChart) {
        myChart.destroy();
    }
    const config = {
        type: "line",
        data,
    };
    const ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, config);
    myChart.canvas.style.backgroundColor = "white";
}
obtenerMonedas();