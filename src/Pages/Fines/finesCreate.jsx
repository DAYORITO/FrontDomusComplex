import React, { useEffect } from "react";
import FormContainer from "../../Components/Forms/FormContainer";
import InputsSelect from "../../Components/Inputs/InputsSelect";
import { fineTypes } from "../../Hooks/consts.hooks";
import Inputs from "../../Components/Inputs/Inputs";
import { Form } from "react-router-dom";
import { useState } from "react";
import FormButton from "../../Components/Forms/FormButton";
import InputTextArea from "../../Components/Inputs/InputTextArea";
import { Uploader } from "../../Components/Uploader/Uploader";
import { useFetchForFile } from "../../Hooks/useFetch";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Select2 from "../../Components/Inputs/Select2";
import { useFetchget } from "../../Hooks/useFetch";
import { get } from "jquery";
import FormColumn from "../../Components/Forms/FormColumn";
import { useParams } from "react-router";
import { tr } from "date-fns/locale";

function FinesCreate() {
  const { id } = useParams();
  const [fineType, setFineType] = useState("");
  const [idApartment, setIdApartment] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [limitDate, setLimitDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const navigate = useNavigate();
  const [apartmets, setApartments] = useState({ apartments: [] });
  const [showModal, setShowmodal] = useState(false);

  const { data, load, error } = useFetchget("apartments");
  console.log(data);

  useEffect(() => {
    // Cuando la carga está en progreso (load es true), activamos el modal de carga
    if (load) {
      // setShowModaload(true);
    } else {
      // Cuando la carga se completa (load es false), desactivamos el modal de carga
      // setShowModaload(false);
    }
  });
  useEffect(
    (data) => {
      if (data && data.apartments) {
        setApartments(getApartments(data));
      }
    },
    [data]
  );

  const getApartments = (data) => {
    const apartmentsList =
      data?.apartments?.map((apartment) => ({
        value: apartment.idApartment,
        label: apartment.apartmentName,
      })) || [];

    // Agrega un registro vacío al principio de la lista
    apartmentsList.unshift({
      value: "",
      label: "",
    });
    console.log(apartmentsList);
    return apartmentsList;
  };

  useEffect(() => {
    if (data && data.apartments) {
      const apartment = data.apartments.find((apartment) => apartment.idApartment === Number(id));
      if (apartment) {
        setIdApartment(apartment.idApartment);
        console.log(apartment.idApartment, "apartment.idApartment");
      }
    }
  }, [data, id]);

  const getApartmentName = (id) => {
    const apartment = data?.apartments?.find(apartment => apartment.idApartment === id);
    return apartment ? apartment.apartmentName : "";
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = 'https://apptowerbackend.onrender.com/api/fines';
    // const url = "http://localhost:3000/api/fines";
    const data = {
      fineType: fineType,
      idApartment: idApartment,
      incidentDate: incidentDate,
      paymentDate: limitDate,
      amount: amount,
      details: description,
      state: "Por pagar",
      evidenceFiles: evidence,
    };

    console.log("Data:", data);

    const { response, error } = await useFetchForFile(url, data);

    console.log(data);

    console.log("Response:", response);
    if (response) {
      Swal.fire({
        title: "Éxito",
        text: "Multa creada exitosamente",
        icon: "success",
      }).then(() => {
        navigate(-1);
      });

    }

    if (error) {
      console.log("Hubo un error");
      Swal.fire({
        title: "Error",
        text: "Error al crear la multa",
        icon: "error",
      });
    }
  };
  return (
    <>
      <FormContainer
        name="Crear multa"
        buttons={
          <FormButton
            name="Crear multa"
            backButton="Cancelar"

            onClick={handleSubmit}
          />
        }
      >
        <FormColumn>
          <InputsSelect
            name="Tipo de multa"
            onChange={(e) => {
              setFineType(e.target.value);
            }}
            options={fineTypes}
          ></InputsSelect>


          {!id ?
            <Select2
              // key={idApartment}
              name="Apartamento"
              value={idApartment || ""}
              onChange={(selectedValue) => {
                setIdApartment(selectedValue);
              }}
              inputStyle={{ border: '1px solid red' }}
              options={getApartments(data)}
            />
            :
            <Inputs
              key={idApartment}
              name="Apartamento"
              value={getApartmentName(idApartment) || ""}
              type="text"
              readonly={true}
              inputStyle={{ backgroundColor: '#F8F8F8' }}
            />
          }
          <Inputs
            name="Fecha del incidente"
            onChange={(e) => {
              setIncidentDate(e.target.value);
            }}
            type="date"
          ></Inputs>

          <Inputs
            name="Fecha limite de pago"
            onChange={(e) => {
              setLimitDate(e.target.value);
            }}
            type="date"
          ></Inputs>
          <Inputs
            name="Monto"
            type="number"
            onChange={(e) => {
              setAmount(e.target.value);
              console.log(amount);
            }}
          ></Inputs>
          <InputTextArea
            name="Descripción"
            onChange={(e) => {
              setDescription(e.target.value);
              console.log(e.target.value);
            }}
          ></InputTextArea>
        </FormColumn>
        <FormColumn>
          <Uploader
            label="Adjuntar evidencia"
            onChange={(e) => {
              setEvidence(e.target.files[0]);
            }}
          ></Uploader>
        </FormColumn>
      </FormContainer>
      {/* {showModal && } */}
    </>
  );
}

export default FinesCreate;
