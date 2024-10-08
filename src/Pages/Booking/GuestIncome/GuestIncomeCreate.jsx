
import FormContainer from '../../../Components/Forms/FormContainer'
import { docTypes, sexs } from "../../../Hooks/consts.hooks"
import FormButton from '../../../Components/Forms/FormButton'
import Inputs from '../../../Components/Inputs/Inputs'
import { useFetchget, useFetchForFile, useFetch } from '../../../Hooks/useFetch'
import { useState, useEffect, useContext } from 'react'
import Select2 from '../../../Components/Inputs/Select2'
import InputsSelect from '../../../Components/Inputs/InputsSelect'
import { createPortal } from 'react-dom'
import { Modal, ModalContainer } from '../../../Components/Modals/ModalTwo'
import Swal from 'sweetalert2'
import { useFetchpost } from '../../../Hooks/useFetch'
import { useNavigate } from "react-router-dom";
import ModalButton from '../../../Components/Modals/ModalButton'
import { useApiUpdate } from '../../../Hooks/FetchputDan'
import { ModalContainerload, Modaload } from "../../../Components/Modals/Modal";
import { dotSpinner } from 'ldrs'
import { set } from 'date-fns'
import { useParams } from 'react-router-dom'
import { Spinner } from '../../../Components/Spinner/Spinner'
import { useUserLogged } from '../../../Helpers/Helpers'
import { SocketContext } from '../../../Context/SocketContext'



function GuestIncomeCreate() {


  const url = import.meta.env.VITE_API_URL;


  const { idUserLogged } = useUserLogged()

  // Socket

  const { socket } = useContext(SocketContext)

  const [LoadingSpiner, setLoadingSpiner] = useState(true);
  const navigate = useNavigate();
  dotSpinner.register()
  //mostrar modales
  const { id } = useParams()
  const [showModalvisitor, setShowModalvisitor] = useState(false);
  const [showModaload, setShowModaload] = useState(false);
  //estados para valores de los select
  const [TowerData, setTowerData] = useState([]);
  const [phone, setPhone] = useState('Seleccione un apartamento');
  const [visitorsData, setVisitorsData] = useState([]);
  const [parkingSpots, setparkingSpots] = useState({ parkingSpaces: [] });
  const [selectedTower, setSelectedTower] = useState(null);
  const [selectedApartments, setSelectedApartments] = useState([]);
  //mostrar el campo de parqueadero
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  //mostrar el nombre del visitante
  const [visitorname, setVisitorname] = useState(' ')

  //Recibe los errores del back

  const [errors, setErrors] = useState([{}])

  //Se crean los estados para los datos del formulario
  const [apartment, setApartment] = useState(null)
  const [personAllowsAccesss, setPersonAllowsAccess] = useState('')
  const [observationss, setObservations] = useState('')
  const [parkingGuestIncome, setParkingGuestIncoming] = useState('')
  const [visitor, setVisitor] = useState(null)

  //Se crean los estados para el modal de visitantes
  const [getNameVisitor, setNameVisitor] = useState([])
  const [documentType, setDocumentType] = useState("");
  const [documentvisitor, setDocumentVisitor] = useState("");
  const [name, setName] = useState("");

  const [lastname, setLastName] = useState("");
  const [genre, setGenre] = useState("");




  const opciones = [
    { value: 'si', label: 'Si' },
    { value: 'no', label: 'No' },
  ]
  const incometype = [
    { value: 'si', label: 'Si' },
    { value: 'no', label: 'No' }
  ]


  //Peticiones a la api
  const { data: dataVisitors, load: load1, error2 } = useFetchget('visitors')
  const { data, load, error } = useFetchget('apartments')
  // const { data: dataResidentApartment, load: load2, error4 } = useFetchget('aparmentResidents')
  const { data: dataResidentApartment, loading: loadResidentsApartment, error: errordata, get: getResidentApartment } = useFetch(url)
  const { data: dataParkingSpaces, load: load3, error3 } = useFetchget('parkingSpaces')
  const { data: dataTowers, load: load4, error5 } = useFetchget('towers')


  useEffect(() => {
    getResidentApartment('aparmentResidents')
  }, [])

  //Muestra o no, el los datos del formulario del vehiculo y la reserva


  const handleChange = (e) => {
    if (e.target.value === 'si') {
      setCheck1(true)
    } else {
      setCheck1(false)
    }
  }

  const handleChange2 = (e) => {
    if (e.target.value === 'si') {
      setCheck2(true)
    } else {
      setCheck2(false)
    }
  }

  const [idTower, setIdTower] = useState(null);
  const [nameTower, setNameTower] = useState('');

  const getTower = (id) => {
    const tower = data?.apartments?.find(tower => tower.idApartment === id);
    if (tower) {
      setIdTower(tower.idTower);
      return tower.idTower;
    }
    return "";
  };

  const getPhone = (id) => {
    const resident = dataResidentApartment.data.apartmentResidents.find(resident => resident.idApartment == id);
    console.log("id al buscar: ", id)
    console.log("residente por apartemaneto: ", dataResidentApartment.data.apartmentResidents)
    console.log("Resident encontrado:", resident)
    if (resident) {
      const user = resident.resident.user;
      if (user && user.phone) {
        return `${user.phone} - ${user.name} ${user.lastName}`;
      }
    }
    return "No habita nadie";
  }

  const getDataTowers = (idTower) => {
    const tower = dataTowers?.towers?.find(tower => tower.idTower === idTower);
    if (tower) {
      setNameTower(tower.towerName);
      return tower.towerName;
    }
    return "";
  };

  useEffect(() => {
    if (apartment) {
      const towerId = getTower(apartment);
      getDataTowers(towerId);
      if (id != null && id != undefined) {
        setPhone(getPhone(id != null ? id : apartment));
      }
    }
  }, [apartment]);




  const getApartmentName = (id) => {
    const apartment = data?.apartments?.find(apartment => apartment.idApartment === id);
    return apartment ? apartment.apartmentName : "";
  };

  //Obtiene las torres de TowerData
  const towers = TowerData.map((towerData) => {
    const matchingTower = dataTowers?.towers?.find((tower) => tower.idTower === parseInt(towerData.tower));
    return {
      value: towerData.tower,
      label: matchingTower ? matchingTower.towerName : 'Torre no encontrada'
    };
  });
  //Obtiene los apartamentos de TowerData
  const organizeApartmentsByTower = (data) => {
    const apartmentsByTower = {};
    // Organizar los apartamentos por torre
    data?.apartments?.forEach((apartment) => {
      const { idApartment, apartmentName, idTower } = apartment;
      // Si no existe la torre, se crea un array vacío
      if (!apartmentsByTower[idTower]) {
        apartmentsByTower[idTower] = [];
      }
      // Se agrega el apartamento al array correspondiente a la torre
      apartmentsByTower[idTower].push({ value: idApartment, label: apartmentName });
    });

    const resultArray = [];

    // Convertir el objeto a un array
    for (const tower in apartmentsByTower) {
      if (apartmentsByTower.hasOwnProperty(tower)) {
        const apartments = apartmentsByTower[tower];

        // Agregar el primer elemento con value y label vacíos
        apartments.unshift({ value: '', label: '' });
        resultArray.push({
          tower,
          apartments: apartmentsByTower[tower]
        });
      }
    }
    console.log("Apartamentos por torre:", resultArray);

    return resultArray;
  };
  const getVisitors = (dataVisitors) => {
    const visitorsList = dataVisitors?.visitors?.map((visitor) => ({
      value: visitor.idVisitor,
      label: `${visitor.documentNumber} ${visitor.access ? '' : '- Acceso no permitido'}`
    })) || [];

    // Agrega un registro vacío al principio de la lista
    visitorsList.unshift({
      value: '',
      label: ''
    });

    return visitorsList;
  };
  const getparkingSpots = (dataParkingSpaces) => {
    return (
      dataParkingSpaces?.parkingSpaces
        ?.filter((park) => park.parkingType === "Public" && park.status === "Active")
        .map((park) => ({
          value: park.idParkingSpace,
          label: park.parkingName
        })) || []
    );
  };



  //Carga los datos de la api para usarlos como variables 

  useEffect(() => {
    if (data.apartments)
      setTowerData(organizeApartmentsByTower(data))
  }, [data])


  useEffect(() => {
    if (dataVisitors.visitors)
      setNameVisitor(dataVisitors.visitors);
    setVisitorsData(getVisitors(dataVisitors))
  }, [dataVisitors]);


  useEffect(() => {
    if (dataParkingSpaces.parkingSpaces)
      setparkingSpots(getparkingSpots(dataParkingSpaces))
  }, [dataParkingSpaces])

  useEffect(() => {
    if (!loadResidentsApartment && towers?.length > 0 && errordata == null
      // && dataTowers?.towers?.length > 0 && data?.apartments?.length > 0 && dataVisitors?.data?.visitors?.length > 0 && dataParkingSpaces?.data?.parkingSpaces?.length > 0 && dataTowers?.data?.towers?.length > 0
    ) {
      setLoadingSpiner(false)
    }
    else if (errordata != null) {
      setLoadingSpiner(false)

    }
    else {
      console.log("Error en la carga de datos:", errordata)
    }

  }, [loadResidentsApartment, towers, errordata])


  //Evento para cambia los datos del select de apartamentos
  const handleTowerChange = (selectedTower) => {
    setPhone('Seleccione un apartamento');
    setSelectedTower(selectedTower);
    console.log(selectedTower)

    // Encuentra los apartamentos correspondientes a la torre seleccionada
    const selectedTowerData = TowerData.find((towerData) => towerData.tower === selectedTower);
    if (apartment) {
      setSelectedApartments(apartment)
    }
    setSelectedApartments(selectedTowerData ? selectedTowerData.apartments : []);

  };
  const handlePhoneSetted = (selectedValue) => {
    selectedValue = selectedValue?.value ? selectedValue?.value : apartment;
    console.log("Selected Value nuevo:", selectedValue);
    setApartment(parseInt(selectedValue?.value))
    console.log('este es mi apartamento ' + apartment)
    console.log('arrayapartmentresidents' + dataResidentApartment.data.apartmentResidents)

    if (dataResidentApartment.data && dataResidentApartment.data.apartmentResidents) {
      const resident = dataResidentApartment.data.apartmentResidents.find(
        (resident) => resident.idApartment === parseInt(selectedValue)
      );


      if (resident && resident.resident && resident.resident.status === "Active") {
        console.log(resident.resident.status)
        const user = resident.resident.user;
        if (user && user.phone) {
          setPhone(`${user.phone} - ${user.name} ${user.lastName}`);
          console.log("Phone Number:", user.phone);
        } else {
          console.log("No phone number registered for this resident.");
          setPhone("No aplica.");
        }
      } else {
        console.log("No active resident found for the selected apartment.");
        setPhone("No aplica");
      }
    } else {
      console.log("No data or apartmentResidents property found.");
      setPhone("No aplica");
    }
  };


  const handleSelectedVisitor = (selectedValue) => {
    console.log("Selected Value:", selectedValue);
    setVisitor(parseInt(selectedValue))
    console.log('este es mi visitante ' + visitor)

    if (dataVisitors && getNameVisitor) {
      const visitor = getNameVisitor.find(
        (visitor) => visitor.idVisitor === parseInt(selectedValue?.value)
      );

      if (visitor) {
        if (visitor.name && visitor.lastname) {
          setVisitorname(visitor.name + ' ' + visitor.lastname);
          console.log("Phone Number:", visitor.name);
        } else {
          console.log("No existe el visitante.");
          setVisitorname("No existe el visitante.");
        }
      } else {
        setVisitorname("No existe");
      }
    } else {

      setVisitorname("No existe");
    }
  }


  useEffect(() => {
    if (data && data.apartments && id !== undefined) {
      const apartment = data.apartments.find((apartment) => apartment.idApartment === Number(id));
      if (apartment) {
        setApartment(apartment.idApartment);
      }
    }
  }, [data, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModaload(true);

    try {
      // Crear el guestIncome
      const formData = {
        // User logged
        "idUserLogged": idUserLogged,
        "startingDate": new Date(),
        "departureDate": null,
        "personAllowsAccess": personAllowsAccesss,
        "observations": observationss ? observationss : "Sin observaciones",
        "idVisitor": visitor?.value,
      }
      if (check2) {
        formData.idApartment = id != null ? id : apartment == null ? "" : parseInt(apartment.value);
      }
      if (check1) {
        formData.idParkingSpace = parkingGuestIncome
        formData.isGuestIncomeVehicle = true
      }
      console.log("Form Data:", formData);
      const { response: guestIncomeResponse, error: guestIncomeError } = await useFetchpost('guestIncome', formData);

      if (guestIncomeError) {
        setErrors(guestIncomeError);
        throw new Error('Error al crear el ingreso');

      }

      // Éxito
      setShowModaload(false);
      console.log('Respuesta exitosa:', guestIncomeResponse);
      Swal.fire({
        title: 'Éxito',
        text: 'Ingreso creado exitosamente',
        icon: 'success',
      }).then(() => {

        if (socket) { socket.disconnect(); socket.connect(); console.log('disconnect and re coneect socket') };
        navigate(-1);
      });
    } catch (error) {
      setShowModaload(false);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error desconocido',
        icon: 'error',
      });
      console.error('Error:', error);
    }
  }


  const handleSubmitVisitor = async (e) => {
    e.preventDefault();
    setShowModaload(true);
    const { response, error } = await useFetchpost('visitors', {
      "name": name,
      "lastname": lastname,
      "documentType": documentType,
      "documentNumber": documentvisitor,
      "genre": genre,
      "access": true
    });
    if (response) {
      console.log("Creo el usuario:", response);

      // Manejar la respuesta exitosa
      const newVisitor = {
        value: response.visitor.idVisitor,
        label: response.visitor.documentNumber
      };
      // Actualizar el estado local agregando el nuevo visitante
      setVisitorsData((prevData) => [newVisitor, ...prevData]);
      setNameVisitor((prevData) => [response.visitor, ...prevData]);
      setShowModaload(false);
      setShowModalvisitor(false);

      console.log('Respuesta exitosa:', response);
      Swal.fire({
        title: 'Éxito',
        text: 'Visitante creado exitosamente',
        icon: 'success',
      })
    }


    if (error) {
      // const errorData = error.errorData;
      // console.log("Errores front:", error);
      setErrors(error);
      setShowModaload(false);
      Swal.fire({
        title: 'Error',
        text: 'Error al crear visitante',
        icon: 'error',
      });
      console.error('Error:', error);
    }
  }
  useEffect(() => {
    if (loadResidentsApartment == true) {

    }
  }, [LoadingSpiner])

  return (
    <>
      <FormContainer name='Crear ingreso de visitante'
        buttons={<FormButton name='Crear' disabled={LoadingSpiner} backButton='Cancelar' onClick={handleSubmit} />}
        modalButton={<ModalButton disabled={LoadingSpiner} name="Crear visitante" onClick={setShowModalvisitor} />}
      >
        {LoadingSpiner && <Spinner></Spinner>}
        <div style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>
          <InputsSelect name={"Ingreso por apartamento"} options={incometype} onChange={handleChange2} required={false} ></InputsSelect>
        </div>
        {
          check2 &&
          <div className='d-flex justify-content-around mb-2' style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>
            <div className='mr-1' style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }} >
              {!id ?
                <InputsSelect errors={errors} inputStyle={{ display: LoadingSpiner ? 'none' : 'block' }} name={'Torre'} voidmessage='No hay torres registradas' onChange={(e) => { { id != null ? handleChange(id) : handleTowerChange(e.target.value) } }} options={towers} />
                :
                <Inputs
                  key={apartment}
                  name="Torre"
                  value={nameTower || ""}
                  type="text"
                  readonly={true}
                  inputStyle={{ backgroundColor: '#F8F8F8' }}
                />
              }
            </div>

            <div className="mr-1" style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>

              {!id ?
                <Select2 inputStyle={{ display: LoadingSpiner ? 'none' : 'block' }} errors={errors} identifier={"idApartment"} value={apartment} placeholder={'Apartamento'} voidmessage='Selecciona una torre' onChange={(selectedValue) => { handlePhoneSetted(selectedValue), setApartment(selectedValue) }} options={selectedApartments}></Select2>
                :
                <Inputs
                  key={apartment}
                  name="Apartamento"
                  value={getApartmentName(apartment) || ""}
                  type="text"
                  readonly={true}
                  inputStyle={{ backgroundColor: '#F8F8F8' }}
                />}

            </div>
            <div style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>

              <Inputs name='Telefono' readonly={true} value={phone} inputStyle={{ backgroundColor: '#F8F8F8', display: LoadingSpiner ? 'none' : 'block' }}></Inputs>

            </div>
          </div>
        }
        <div className='d-flex justify-content-around' style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>
          <div className='mr-1' style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>
            <Select2 errors={errors} identifier={"idVisitor"} placeholder={'Visitante'} value={visitor} onChange={(selectedValue) => { handleSelectedVisitor(selectedValue), setVisitor(selectedValue), console.log("valor selec", selectedValue) }} options={visitorsData}></Select2>
          </div>
          <div style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>
            <Inputs name='Nombre' readonly={true} value={visitorname} ></Inputs>
          </div>

        </div>
        <div style={{ display: LoadingSpiner ? 'none' : 'block', width: '100%' }}>
          <InputsSelect inputStyle={{ display: LoadingSpiner ? 'none' : 'block' }} name="Ingreso con vehículo" style="width: 100%" id={'tipoingreso'} required={false} onChange={handleChange} options={opciones}></InputsSelect>
        </div>
        {
          check1 &&
          <InputsSelect name="Parqueadero" voidmessage='No hay parqueaderos disponibles' identifier={"idParkingSpace"} errors={errors} onChange={(e) => setParkingGuestIncoming(e.target.value)} options={parkingSpots}></InputsSelect>
        }
        <div style={{ width: '100%', display: LoadingSpiner ? 'none' : 'block' }}>
          <Inputs name="Persona que permite el acceso" type="text" errors={errors} identifier={"personAllowsAccess"} onChange={(e) => { setPersonAllowsAccess(e.target.value) }}></Inputs>
          <Inputs name="Observaciones" type="text" errors={errors} identifier={"observations"} required={false} onChange={(e) => { setObservations(e.target.value) }}></Inputs>
        </div>
      </FormContainer>
      {
        showModalvisitor &&
        createPortal(
          <ModalContainer showModal={setShowModalvisitor}>
            <Modal title={'Crear Visitante'} showModal={setShowModalvisitor} onClick={handleSubmitVisitor}>
              <InputsSelect name="Tipo de documento" errors={errors} identifier={"documentType"} options={docTypes} onChange={(e) => setDocumentType(e.target.value)} />
              <Inputs name="Numero Documento" errors={errors} identifier={"documentNumber"} onChange={(e) => setDocumentVisitor(e.target.value)} />
              <Inputs name="Nombre" errors={errors} identifier={"name"} onChange={(e) => setName(e.target.value)} />
              <Inputs name="Apellido" errors={errors} identifier={"lastname"} type="text" onChange={(e) => setLastName(e.target.value)} />
              <InputsSelect name="Genero" errors={errors} identifier={"genre"} options={sexs} onChange={(e) => setGenre(e.target.value)} />
            </Modal>
          </ModalContainer>,
          document.getElementById('modalRender')
        )
      }
      {showModaload &&
        createPortal(
          <>
            <ModalContainerload ShowModal={setShowModaload}>
              <Modaload
                showModal={setShowModaload}
              >
                <div className='d-flex justify-content-center'>
                  <l-dot-spinner
                    size="50"
                    speed="2"
                    color="black"
                  ></l-dot-spinner>
                </div>
                <div className='d-flex justify-content-center'>

                  <p className='mt-2 text-muted'>Cargando datos...</p>
                </div>


              </Modaload>
            </ModalContainerload>
          </>,
          document.getElementById("modalRender")
        )}
    </>
  )
}

export default GuestIncomeCreate