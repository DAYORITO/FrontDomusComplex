import { ContainerTable } from "../../../Components/ContainerTable/ContainerTable";
import {
  ButtonGoTo,
  DropdownExcel,
  SearchButton,
} from "../../../Components/Buttons/Buttons";
import { TablePerson } from "../../../Components/Tables/Tables";
import { Thead } from "../../../Components/Thead/Thead";
import { Th } from "../../../Components/Th/Th";
import { Tbody } from "../../../Components/Tbody/Tbody";
import { Row } from "../../../Components/Rows/Row";
import { Actions } from "../../../Components/Actions/Actions";
import {
  useAllowedPermissionsAndPrivileges,
  useFetchget,
} from "../../../Hooks/useFetch";
import { useFetchForFile } from "../../../Hooks/useFetch";

import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ModalContainerload, Modaload } from "../../../Components/Modals/Modal";
import { dotSpinner } from "ldrs";
import { useAuth } from "../../../Context/AuthContext";
import Cookies from "js-cookie";
import {
  idToPermissionName,
  idToPrivilegesName,
} from "../../../Hooks/permissionRols";
import { Spinner } from "../../../Components/Spinner/Spinner";
import { SocketContext } from "../../../Context/SocketContext";
import { usePaginator, useUserLogged } from "../../../Helpers/Helpers";
import { Paginator } from "../../../Components/Paginator/Paginator";

function GuestIncome() {

  // Socket

  const { socket } = useContext(SocketContext)

  // User logged

  const { idUserLogged, idRolLogged } = useUserLogged()

  const { data: dataRols, loadRols, errorRols } = useFetchget('rols');

  const nameRole = dataRols?.rols?.find(rol => rol.idrole === idRolLogged)?.namerole;



  const [LoadingSpiner, setLoadingSpiner] = useState(true);
  // const {permisos} = useAuth()
  // if(!permisos.incudes("Ver Ingreso")){
  //     navigate
  // }
  dotSpinner.register();
  //se crea un estado para actualizar los datos al momento de cualquier accion
  const [guestIncomeData, setGuestIncomeData] = useState([]);
  const [guestIncomeParkingData, setGuestIncomeParkingData] = useState({
    guestIncomeParking: [],
  });

  const [showModaload, setShowModaload] = useState(false);
  const { data, load, error } = useFetchget("guestIncome");
  const {
    data: data2,
    load: load2,
    error: error2,
  } = useFetchget("guestincomeparking");
  const [originalGuestIncomeData, setOriginalGuestIncomeData] = useState([]);

  //Consulta Privilegios

  const allowedPermissions = useAllowedPermissionsAndPrivileges(
    idToPermissionName,
    idToPrivilegesName
  );

  //   console.log(data2);

  //   console.log(data);

  function sortGuestIncome(guestIncome) {
    return guestIncome.sort((a, b) => {
      // Si a o b tienen fecha de salida null, los ponemos primero
      if (a.departureDate === null) return -1;
      if (b.departureDate === null) return 1;

      // Si ambos tienen fecha de salida, los ordenamos de forma descendente
      return new Date(b.departureDate) - new Date(a.departureDate);
    });
  }

  useEffect(() => {
    if (data && data.guestIncome) {
      setGuestIncomeData(sortGuestIncome(data.guestIncome));
      setOriginalGuestIncomeData(sortGuestIncome(data.guestIncome));
    }
  }, [data, data.guestIncome]);

  useEffect(() => {
    if (data2 && data2.guestincomeparking) {
      setGuestIncomeParkingData(data2.guestincomeparking);
    }
  }, [data2]);

  useEffect(() => {
    // Cuando la carga está en progreso (load es true), activamos el modal de carga
    if (!load) {
      setLoadingSpiner(false);
      // Cuando la carga se completa (load es false), desactivamos el modal de carga
    }
  }, [load]);

  const handleEditClick = async (dataToUpdate) => {
    setShowModaload(true);

    console.log("Datos a actualizar:", dataToUpdate);

    try {

      const guestIncomeUpdateUrl = `${import.meta.env.VITE_API_URL}guestIncome`;

      const { response: guestIncomeResponse, error } = await useFetchForFile(
        guestIncomeUpdateUrl,
        dataToUpdate,
        "PUT"
      );

      console.log("Respuesta del ingreso", guestIncomeResponse);
      console.log("Error del ingreso", error);

      if (error != null && error !== undefined) {
        console.log("Error al actualizar los datos del ingreso2:", error);
        throw new Error(error);
      }

      Swal.fire({
        icon: "success",
        title: "Salida registrada con éxito.",
        showConfirmButton: false,
        timer: 1500,
      });

      const updatedGuestIncome = guestIncomeData.map((guestIncome) => {
        if (guestIncome.idGuest_income === dataToUpdate.idGuest_income) {
          guestIncome.departureDate = dataToUpdate.departureDate;
        }
        return guestIncome;
      });

      setGuestIncomeData(updatedGuestIncome);
    } catch (error) {
      console.error(
        "Error al actualizar los datos del ingreso o el estado del espacio de estacionamiento:",
        error
      );
      Swal.fire({
        icon: "error",
        title: "Error al registrar la salida.",
        text: error
      });
    } finally {
      setShowModaload(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CO", {
      format: "dd/MM/yyyy HH:mm:ss",
    });
  };


  //buscar

  function handleChange(e) {
    searcher(e.target.value);
  }

  function searcher(searchValue) {
    if (!searchValue) {

      return setGuestIncomeData(originalGuestIncomeData);
    }

    searchValue = searchValue.trim().toLowerCase();

    let filteredData = originalGuestIncomeData.filter((dato) => {
      const apartmentName = dato?.guestIncomeApartment?.asociatedApartment?.apartmentName
        .toString()
        .toLowerCase();
      const guestFullName = (
        dato?.asociatedVisitor.name +
        " " +
        dato?.asociatedVisitor.lastname
      ).toLowerCase();
      return (
        apartmentName?.includes(searchValue) ||
        guestFullName?.includes(searchValue)
      );
    });
    console.log(filteredData.length, "Datos filtrados:", filteredData);
    setGuestIncomeData(filteredData);
  }


  const { totalPages, currentPage, nextPage, previousPage, filteredData: filteredDataguestIncome } = usePaginator(guestIncomeData, 4);


  return (
    <>
      <ContainerTable
        title="Ingresos de visitantes"
        dropdown={nameRole ? (nameRole.toLowerCase().includes('vigilante') || nameRole.toLowerCase().includes('seguridad') || nameRole.toLowerCase().includes('vigilancia') ? null : <DropdownExcel table="guestIncome" />) : <DropdownExcel table="guestIncome" />}
        search={<SearchButton type="text" onChange={handleChange} />}
        buttonToGo={
          allowedPermissions["Ingresos"] &&
            allowedPermissions["Ingresos"].includes("Crear") ? (
            <ButtonGoTo value="Crear Ingreso" href="create" />
          ) : null
        }
        showPaginator={<Paginator totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} previousPage={previousPage} />}
      >
        <TablePerson>
          <Thead>
            <Th name={"Información del Ingreso"}></Th>
            <Th name={"Fecha inicio"}></Th>
            <Th name={"Fecha fin"}></Th>
            <Th name={"Acciones"}></Th>
          </Thead>
          <Tbody>
            {/* <Row
                            docType='Apto visitado'
                            docNumber='405'
                            name='Daniel'
                            lastName='Rivera'
                            phone='No registrada'
                            email='2023-11-02 11:45'
                        >
                            <Actions accion='Registrar salida'></Actions>
                            <Actions accion='Detalles del Ingreso'></Actions>
                        </Row> */}
            {LoadingSpiner ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                  position: "fixed",
                  left: "52%",
                  top: "45%",
                  transform: "translate(-50%, -24%)",
                }}
              >
                <Spinner />
              </div>
            ) : (
              filteredDataguestIncome()?.map((Income) => (
                <Row
                  A3="Ingreso a:"
                  A4={Income.guestIncomeApartment ? Income?.guestIncomeApartment?.asociatedApartment?.apartmentName : "Servicio del conjunto"}
                  A1={Income?.asociatedVisitor.name}
                  A2={Income?.asociatedVisitor.lastname}
                  A7={
                    Income?.departureDate == null
                      ? "No registrada"
                      : formatDate(Income?.departureDate)
                  }
                  A6={formatDate(Income?.startingDate)}
                  to={`details/${Income?.idGuest_income}`}
                >
                  {Income?.departureDate == null ? (
                    <Actions
                      accion="Registrar salida"
                      onClick={() => {
                        handleEditClick({
                          idGuest_income: Income.idGuest_income,
                          departureDate: new Date(),
                        });
                      }}
                    ></Actions>
                  ) : (
                    null
                  )}

                </Row>
              ))
            )}
          </Tbody>
        </TablePerson>
      </ContainerTable>
      {showModaload &&
        createPortal(
          <>
            <ModalContainerload ShowModal={setShowModaload}>
              <Modaload showModal={setShowModaload}>
                <div className="d-flex justify-content-center">
                  <l-dot-spinner
                    size="50"
                    speed="2"
                    color="black"
                  ></l-dot-spinner>
                </div>
              </Modaload>
            </ModalContainerload>
          </>,
          document.getElementById("modalRender")
        )}
    </>
  );
}

export default GuestIncome;
