const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const url = "http://localhost:3000/transportasi";

    const transportasi = ref({
      id: null,
      keberangkatan: "",
      jadwal: "",
      harga: "",
      list: [],
      errorMessage: "",
      isError: false,
      isUpdate: false,
    });

    const getTransportasi = async () => {
      try {
        transportasi.value.isUpdate = false;
        const resTransportasi = await axios.get(url);
        if (resTransportasi.data.length === 0)
          throw new Error("Jadwal Belum Ada");
        transportasi.value.list = resTransportasi.data;
        return resTransportasi.data;
      } catch (err) {
        transportasi.value.isError = true;
        transportasi.value.errorMessage = err.message;
        transportasi.value.isUpdate = false;
      }
    };

    const getTransportasiById = async (id) => {
      try {
        const resTransportasi = await axios.get(url + `/${id}`);
        if (resTransportasi.data.length === 0)
          throw new Error("Belum Ada Data");
        transportasi.value.isUpdate = true;
        transportasi.value.id = id;
        transportasi.value.keberangkatan = resTransportasi.data.keberangkatan;
        transportasi.value.jadwal = resTransportasi.data.jadwal;
        transportasi.value.harga = resTransportasi.data.harga;
        return resTransportasi.data;
      } catch (err) {
        transportasi.value.keberangkatan = "";
        transportasi.value.jadwal = "";
        transportasi.value.harga = "";
        transportasi.value.isUpdate = false;
        transportasi.value.isError = true;
        transportasi.value.errorMessage = err.message;
      }
    };

    const deleteTransportasi = async (id) => {
      try {
        transportasi.value.isUpdate = false;
        const resTransportasi = await axios.delete(url + "/delete", {
          data: {
            id,
          },
        });
        if (resTransportasi.data.length === 0)
          throw new Error("Tidak Ada Data");
        transportasi.value.list = resTransportasi.data;
        await getTransportasi();
        return resTransportasi.data;
      } catch (err) {
        transportasi.value.isError = true;
        transportasi.value.errorMessage = err.message;
      }
    };

    const submitTransportasi = async () => {
      try {
        transportasi.value.isUpdate = false;
        await axios.post(url + "/create", {
          keberangkatan: transportasi.value.keberangkatan,
          jadwal: transportasi.value.jadwal,
          harga: transportasi.value.harga,
        });
        console.log("Trigger");
        transportasi.value.isError = false;
        transportasi.value.keberangkatan = "";
        transportasi.value.jadwal = "";
        transportasi.value.harga = "";
        transportasi.value.isUpdate = false;
        await getTransportasi();
      } catch (err) {
        transportasi.value.isError = true;
        transportasi.value.errorMessage = err.message;
      }
    };

    const updateTransportasi = async () => {
      try {
        transportasi.value.isUpdate = true;
        const put = await axios.put(url + "/update", {
          id: transportasi.value.id,
          keberangkatan: transportasi.value.keberangkatan,
          jadwal: transportasi.value.jadwal,
          harga: transportasi.value.harga,
        });
        if (!put) throw new Error("Gagal mengubah data");
        await getTransportasi();
      } catch (err) {
        transportasi.value.isUpdate = false;
        transportasi.value.isError = true;
        transportasi.value.errorMessage = err.message;
      }
    };

    onMounted(async () => {
      await getTransportasi();
    });

    return {
      transportasi,
      submitTransportasi,
      updateTransportasi,
      deleteTransportasi,
      getTransportasiById,
    };
  },
});

app.mount("#app");
