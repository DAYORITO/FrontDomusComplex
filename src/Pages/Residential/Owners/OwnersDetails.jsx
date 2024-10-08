import React, { useContext, useEffect, useState } from 'react'

import { Details } from "../../../Components/Details/details"
import Inputs from '../../../Components/Inputs/Inputs'
import InputsSelect from "../../../Components/Inputs/InputsSelect"
import { docTypes, sexs, statusList } from "../../../Hooks/consts.hooks"
import { TablePerson } from '../../../Components/Tables/Tables'
import { TableDetails } from "../../../Components/TableDetails/TableDetails"
import { NavDetails } from "../../../Components/NavDetails/NavDetails"
import { NavListDetails } from "../../../Components/NavListDetails/NavListDetails"
import { ListsDetails } from "../../../Components/ListsDetails/ListsDetails"
import { InfoDetails } from "../../../Components/InfoDetails/InfoDetails"
import { ButtonGoTo, SearchButton } from "../../../Components/Buttons/Buttons"
import { DetailsActions } from "../../../Components/DetailsActions/DetailsActions"
import { useFetch, useFetchget, useFetchgetById } from "../../../Hooks/useFetch"
import { Dropdownanchor, Dropdownanchor2 } from "../../../Components/DropDownAnchor/Dropdownanchor"
import { ContainerModule } from "../../../Components/ContainerModule/ContainerModule"
import { DropdownInfo } from "../../../Components/DropdownInfo/DropdownInfo"
import { Acordions } from "../../../Components/Acordions/Acordions"
import { RowNotificactions } from "../../../Components/RowNotificacions/RowNotificactions"
import { NotificationsAlert } from "../../../Components/NotificationsAlert/NotificationsAlert"
import { ModalContainer, Modal } from "../../../Components/Modals/ModalTwo"

import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { format } from 'date-fns';
import { SmalSpinner, Spinner } from '../../../Components/Spinner/Spinner'
import { createPortal } from 'react-dom'
import { Uploader } from '../../../Components/Uploader/Uploader'
import { postRequest, useUserLogged } from '../../../Helpers/Helpers'
import { SocketContext } from '../../../Context/SocketContext'

export const OwnerDetail = () => {

  // API URL

  const url = import.meta.env.VITE_API_URL;
  // const url = "https://apptowerbackend.onrender.com/api/"


  // Owner information

  const { id } = useParams();

  // Socket

  const { socket } = useContext(SocketContext)

  // User logged

  const { idUserLogged, idRolLogged } = useUserLogged();

  const { data: rols, get: getRols } = useFetch(url);

  useEffect(() => {
    getRols(`rols`);
  }, []);

  const nameRole = rols?.data?.rols?.find((rol) => rol.idrole == idRolLogged)?.namerole.toLowerCase();


  const [idOwner, setIdOwner] = useState(id)
  const [idUser, setIdUser] = useState("")
  const [idApartment, setIdApartment] = useState("")

  const [ownershipStartDate, setOwnershipStartDate] = useState("")

  const [statusOwner, setStatusOwner] = useState("")
  const [ownerCreateAt, setOwnerCreateAt] = useState("")
  const [updatedAt, setOwnerUpdatedAt] = useState("")

  const [ownerPdf, setOwnerPdf] = useState("")
  const [docType, setDocType] = useState("")
  const [pdf, setPdf] = useState("")
  const [docNumber, setDocNumber] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthday, setBirthday] = useState("")
  const [sex, setSex] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [userStatus, setUserStatus] = useState("")

  const [apartments, setApartments] = useState([])


  const [age, setAge] = useState(null);

  const [newPdf, setNewPdf] = useState("")

  const [errorList, setErrorList] = useState([])


  // Owners relations

  const { data: owner, get: getOwner, loading: loadingOwner } = useFetch(url)
  const { data: owners, get: getOwners, loading } = useFetch(url)
  const { data: apartmentss, get: getApartments, loading: loadingApartments } = useFetch(url)


  useEffect(() => {

    // Owner information

    // setIdOwner(owner?.data?.owner?.idOwner)
    setIdUser(owner?.data?.owner?.iduser)
    setStatusOwner(owner?.data?.owner?.status)
    setOwnerCreateAt(owner?.data?.owner?.createAt)
    setOwnerUpdatedAt(owner?.data?.owner?.updateAt)

    setOwnerPdf(owner?.data?.owner?.user?.pdf)
    setDocType(owner?.data?.owner?.user?.docType)
    setPdf(owner?.data?.owner?.user?.pdf)
    setDocNumber(owner?.data?.owner?.user?.document)
    setName(owner?.data?.owner?.user?.name)
    setLastName(owner?.data?.owner?.user?.lastName)
    setBirthday(owner?.data?.owner?.user?.birthday)
    setSex(owner?.data?.owner?.user?.sex)
    setEmail(owner?.data?.owner?.user?.email)
    setPhone(owner?.data?.owner?.user?.phone)

    setUserStatus(owner?.data?.owner?.user?.status)

    getOwners("owners")
    getApartments("apartments")

    setApartments(owner?.data?.apartments)

    if (owner?.data?.owner?.user?.birthday) {
      const birthDate = new Date(owner.data.owner.user.birthday);
      const currentDate = new Date();
      const difference = currentDate - birthDate;
      const ageInMilliseconds = new Date(difference);
      const calculatedAge = Math.abs(ageInMilliseconds.getUTCFullYear() - 1970);

      setAge(calculatedAge);
    }

  }, [owner?.data?.owner])


  useEffect(() => {

    try {

      getOwner(`owners/${id}`)


    } catch (error) {

      console.error('Error al obtener datos del apartamento', error);

    }



  }, [])


  // Edit personal information owner

  const [modalPersonalInfoOwner, setModalPersonalInfoOwner] = useState(false);

  const openModalEdit = (data) => {

    console.log(data)
    setModalPersonalInfoOwner(true)

    setIdUser(data.owner.iduser)
    setDocType(data.user.docType)
    setDocNumber(data.user.document)
    setName(data.user.name)
    setLastName(data.user.lastName)
    setBirthday(format(new Date(data.user.birthday), 'yyyy-MM-dd'))
    setSex(data.user.sex)
    setEmail(data.user.email)
    setPhone(data.user.phone)

    setErrorList('')

  }

  const updatePersonalInfo = async (event) => {

    const data = {

      // User logged

      idUserLogged: idUserLogged,

      iduser: idUser,
      pdf: pdf,
      newFile: newPdf,
      docType: docType,
      document: docNumber,
      name: name,
      lastName: lastName,
      birthday: birthday,
      sex: sex,
      email: email,
      phone: phone,
    }

    console.log("edit data", data)

    await postRequest(event, 'users/personalInfo', 'PUT', setModalPersonalInfoOwner, data, url, setErrorList, null, socket);
    getOwner(`owners/${id}`)

  }

  // Assigned apartment to owner

  const [modalAssigApartmentToOwner, setModalAssigApartmentToOwner] = useState(false);

  const openModalAssingApartmentToOwner = () => {

    setIdOwner(id)
    setModalAssigApartmentToOwner(true)
    setErrorList('')

  }

  const CreateApartmentOwner = async (event) => {

    const data = {

      // User logged

      idUserLogged: idUserLogged,

      idApartment: idApartment,
      idOwner: idOwner,
      OwnershipStartDate: ownershipStartDate,

    }


    await postRequest(event, 'apartmentOwners', 'POST', setModalAssigApartmentToOwner, data, url, setErrorList, null, socket)

    getOwner(`owners/${id}`)

  };

  // Change status owener

  const ChangeStatusOwner = async (event) => {

    const data = {

      // User logged

      idUserLogged: idUserLogged,
      idOwner: idOwner,

    }


    await postRequest(event, 'owners', 'PUT', null, data, url, setErrorList, null, socket)

    getOwner(`owners/${id}`);

  };


  // List owners

  const ownersList = owners && owners?.data?.owners
    ? owners?.data?.owners
      .filter(owner => owner.status === 'Active')
      .map(owner => ({
        value: owner.idOwner,
        label: ` ${owner.user.name} ${owner.user.lastName} - ${owner.user.document}`
      }))
    : [];

  // List apartments

  const apartmentList = apartmentss?.data && apartmentss?.data?.apartments

    ? apartmentss.data.apartments
      .filter(apartment => apartment.status === 'Active')
      .map(apartment => ({
        value: apartment.idApartment,
        label: `${apartment.apartmentName} - ${apartment.Tower.towerName}`
      }))
    : [];

  // Edit owners

  // const handleUpdateApartmentResident = async (event) => {



  //   const data = {

  //     idApartmentResident: idApartmentResident,
  //     idResident: idResident,
  //     idApartment: idApartment,
  //     residentStartDate: residentStartDate,
  //     residentEndDate: residentEndDate,
  //     status: statusApartmentResident


  //   }

  //   console.log("edit data", data)

  //   await postRequest(event, 'aparmentResidents', 'PUT', {}, data, url);
  //   setShowApartmentResidentEditModal(false)


  // };

  return (
    <>
      <Details>

        {

          loadingOwner ? <Spinner /> :

            <ContainerModule

              icon='user'
              to={nameRole && !nameRole.includes('residente') ? '/admin/owners/' : null}

              A1={`Propietario ${name}`}
              A2={`${lastName}`}
              // A3={`${docType} ${document}`}
              A5={`Correo electrónico: ${email}`}
              A6={`Teléfono: ${phone}`}
              A7={nameRole && !nameRole.includes('residente') ? pdf : null}
              status={statusOwner}
              onClickEdit={openModalEdit}
              actionOnClick2={nameRole && !nameRole.includes('residente') ? (statusOwner == 'Active' ? 'Desactivar' : 'Activar') : null}
              onClick2={() => ChangeStatusOwner(event)}
            />

        }



        <InfoDetails>

          <Acordions>

            <DropdownInfo
              name={`Informacion personal`}
              action1={nameRole && !nameRole.includes('residente') ? 'Editar informacion personal' : null}
              onClickAction1={openModalEdit}
            >

              <ul className='list-unstyled'>
                <li>Nombre: {name}</li>
                <li>Apellidos: {lastName}</li>
                <li>Tipo de documento: {docType}</li>
                <li>Numero de documento: {docNumber}</li>
                <li>edad: {age} años</li>
                <li>Genero: {sex == 'M' ? 'Mascualino' : 'Femenino'}</li>
                {/* <li>{email}</li>
              <li>{phone}</li> */}


              </ul>

            </DropdownInfo>

            <DropdownInfo
              name={`Propiedades`}
              action1={nameRole && !nameRole.includes('residente') ? 'Asignar apartamento' : null}
              onClickAction1={openModalAssingApartmentToOwner}
            >

              {
                loadingOwner ? <SmalSpinner /> : (
                  apartments && apartments.length > 0 ? (
                    apartments.map((apartment, index) => (
                      <Dropdownanchor
                        key={index}
                        name={`Apartamento ${apartment.apartment.apartmentName}`}
                        to={`/admin/apartments/details/${apartment.apartment.idApartment}`}
                        status={apartment.status}
                      />
                    ))
                  ) : (
                    <NotificationsAlert msg={`Debes asignarle una propiedad`} />
                  )
                )
              }

            </DropdownInfo>


          </Acordions>

        </InfoDetails>

      </Details >

      {modalAssigApartmentToOwner &&
        createPortal(
          <>
            <ModalContainer showModal={setModalAssigApartmentToOwner}>
              <Modal
                onClick={CreateApartmentOwner}
                showModal={setModalAssigApartmentToOwner}
                title={`Asignar propiedad`}

              >

                <InputsSelect disabled id={"select"} options={ownersList} name={"Propietario"}
                  identifier={'idOwner'} errors={errorList}
                  value={idOwner} onChange={e => setIdOwner(e.target.value)}
                ></InputsSelect>

                <InputsSelect id={"select"} options={apartmentList} name={"Propiedad"}
                  identifier={'idApartment'} errors={errorList}
                  value={idApartment} onChange={e => setIdApartment(e.target.value)}
                ></InputsSelect>

                <Inputs name="Fecha desde cuando es propietario" type={"date"}
                  identifier={'OwnershipStartDate'} errors={errorList}
                  value={ownershipStartDate} onChange={e => setOwnershipStartDate(e.target.value)}></Inputs>


              </Modal>
            </ModalContainer>
          </>,
          document.getElementById("modalRender")
        )
      }

      {modalPersonalInfoOwner &&
        createPortal(
          <>
            <ModalContainer ShowModal={setModalPersonalInfoOwner}>
              <Modal
                onClick={updatePersonalInfo}
                showModal={setModalPersonalInfoOwner}
                title={"Editar informacion personal"}

              >
                <Uploader name="img" formatos='.pdf' label="Documento de identidad" onChange={e => setNewPdf(e.target.files[0])} />

                <InputsSelect id={"select"} options={docTypes} name={"Tipo de documento"}
                  identifier={'docType'} errors={errorList}
                  value={docType} onChange={e => setDocType(e.target.value)}
                ></InputsSelect>

                <Inputs name="Numero de documento" type={"text"}
                  identifier={'document'} errors={errorList}
                  value={docNumber} onChange={e => setDocNumber(e.target.value)}></Inputs>

                <Inputs name="Nombres" type={"text"}
                  identifier={'name'} errors={errorList}
                  value={name} onChange={e => setName(e.target.value)}></Inputs>

                <Inputs name="Apellidor" type={"text"}
                  identifier={'lastName'} errors={errorList}
                  value={lastName} onChange={e => setLastName(e.target.value)}></Inputs>

                <Inputs name="Fecha de cumpleaños" type={"date"}
                  identifier={'birthday'} errors={errorList}
                  value={birthday} onChange={e => setBirthday(e.target.value)}></Inputs>

                <InputsSelect id={"select"} options={sexs} name={"Genero"}
                  identifier={'sex'} errors={errorList}
                  value={sex} onChange={e => setSex(e.target.value)}
                ></InputsSelect>

                <Inputs name="Correo electronico" type={"text"}
                  identifier={'email'} errors={errorList}
                  value={email} onChange={e => setEmail(e.target.value)}></Inputs>

                <Inputs name="Numero de telefono" type={"text"}
                  identifier={'phone'} errors={errorList}
                  value={phone} onChange={e => setPhone(e.target.value)}></Inputs>

                <Inputs type={"hidden"}
                  value={idUser} onChange={e => setIdUser(e.target.value)}></Inputs>
              </Modal>
            </ModalContainer>
          </>,
          document.getElementById("modalRender")
        )}

    </>
  )
}
