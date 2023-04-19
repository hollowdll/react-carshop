import { useState, useEffect } from "react";
import { IconButton, Stack } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";

import DeleteIcon from "@mui/icons-material/DeleteRounded";

import AddCar from "./AddCar";
import EditCar from "./EditCar";

function CarList() {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    fetch("https://carrestapi.herokuapp.com/cars")
      .then(response => {
        if (!response.ok) {
          setMessage("Failed to fetch cars");
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((responseData) => setCars(responseData["_embedded"].cars))
      .catch((err) => console.error(err));
  }

  const columnDefs = [
    { field: "brand" },
    { field: "model" },
    { field: "color" },
    { field: "fuel" },
    { field: "year" },
    { field: "price" },
    // Edit button column
    {
      headerName: "",
      width: 200,
      filter: false,
      sortable: false,
      field: "_links.self.href",
      cellStyle: { border: 'none' },
      cellRenderer: (params) => {
        return (
          <EditCar updateCar={updateCar} params={params} />
        );
      },
    },
    // Delete button column
    {
      headerName: "",
      width: 200,
      filter: false,
      sortable: false,
      field: "_links.self.href",
      cellStyle: { border: 'none' },
      cellRenderer: (params) => {
        return (
          <IconButton onClick={() => deleteCar(params.value)} color="error">
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  const addCar = (car) => {
    console.log("add car");
    console.log(car);

    fetch("https://carrestapi.herokuapp.com/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car)
    })
    .then(response => {
      if (!response.ok) {
        setMessage("Failed to add car");
        throw new Error("Fetch failed: " + response.statusText);
      }

      setMessage("Car added successfully");
      fetchCars();
    })
    .catch(err => console.error(err));
  };

  const updateCar = (car, link) => {
    console.log("update car");
    console.log(car);

    fetch(link, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car)
    })
    .then(response => {
      if (!response.ok) {
        setMessage("Failed to update car");
        throw new Error("Fetch failed: " + response.statusText);
      }

      setMessage("Car updated successfully");
      fetchCars();
    })
    .catch(err => console.error(err))
  };

  const deleteCar = (link) => {
    console.log("delete car")
    console.log(link);

    if (window.confirm("Are you sure you want to delete this car?")) {
      fetch(link, {
        method: "DELETE"
      })
      .then(response => {
        if (!response.ok) {
          setMessage("Failed to delete car");
          throw new Error("Fetch failed: " + response.statusText);
        }
  
        setMessage("Car deleted successfully");
        fetchCars();
      })
      .catch(err => console.error(err));
    }
  };

  return (
    <div className="car-list">
      <h4>{message}</h4>
      <Stack spacing={2} direction="row">
        <AddCar addCar={addCar} />
      </Stack>
      <div
        className="ag-theme-material"
        style={{ height: "500px", width: "100%", margin: "auto" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={cars}
          defaultColDef={{
            flex: 1,
            filter: true,
            sortable: true,
          }}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default CarList;
