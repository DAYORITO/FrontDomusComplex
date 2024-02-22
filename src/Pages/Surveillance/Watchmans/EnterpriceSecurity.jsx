import { Actions } from "../../../Components/Actions/Actions"
import { BigCard } from "../../../Components/BigCard/BigCard"
import { ButtonGoTo, DropdownExcel, SearchButton } from "../../../Components/Buttons/Buttons"
import { Card } from "../../../Components/Card/Card"
import { ContainerCard } from "../../../Components/ContainerCard/ContainerCard"
import { ContainerTable } from "../../../Components/ContainerTable/ContainerTable"
import { TablePerson } from "../../../Components/Tables/Tables"
import { useEffect, useState } from "react"

import { useAllowedPermissionsAndPrivileges, useFetch } from '../../../Hooks/useFetch'


import usePaginator, { filter, postRequest, putRequest } from "../../../Helpers/Helpers"
import { Modal, ModalContainer } from "../../../Components/Modals/ModalTwo"
import { createPortal } from "react-dom"


import Inputs from '../../../Components/Inputs/Inputs'
import { statusList } from "../../../Hooks/consts.hooks"
import InputsSelect from "../../../Components/Inputs/InputsSelect"
import { Uploader } from "../../../Components/Uploader/Uploader"

import dataNotFoundImg from "../../../assets/dataNotFound.jpg"
import { Spinner } from "../../../Components/Spinner/Spinner"
import { idToPermissionName, idToPrivilegesName } from "../../../Hooks/permissionRols"

import Cookies from 'js-cookie'
import { Paginator } from "../../../Components/Paginator/Paginator"
import { set } from "date-fns"
import { Row } from "../../../Components/Rows/Row"
import { Thead } from "../../../Components/Thead/Thead"
import { Th } from "../../../Components/Th/Th"
import { Tbody } from "../../../Components/Tbody/Tbody"
import { ModalContainerload, Modaload } from "../../../Components/Modals/Modal"
import { dotSpinner } from 'ldrs'




export const EnterpriceSecurity = () => {
    const token = Cookies.get('token');
    dotSpinner.register()
    const [showModaload, setShowModaload] = useState(true);

    const url = "http://localhost:3000/api/"
    // const url = "https://apptowerbackend.onrender.com/api/"

    // Enterprice information

    const [nameEnterprice, setNameEnterprice] = useState("");
    const [email, setEmail] = useState("");
    const [NIT, setNIT] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [idEnterpriseSecurity, setIdEnterpriseSecurity] = useState("");
    const [state, setStatus] = useState("");

    const [IsEditedEnterprice, setIsEditedEnterprice] = useState(true);
    const [EnterpriceFormModal, setEnterpriceFormModal] = useState(false);

    const openEnterpriceModal = (data) => {

        console.log(data)

        if (data == null) {

            setIsEditedEnterprice(false)
            setPhone('')
            setAddress('')
            setIdEnterpriseSecurity('')
            setStatus('')
            setNIT('')
            setEmail('')
            setNameEnterprice('')


        } else {

            setIsEditedEnterprice(true)
            setPhone(data.phone)
            setAddress(data.address)
            setIdEnterpriseSecurity(data.idEnterpriseSecurity)
            setStatus(data.state)
            setNIT(data.NIT)
            setEmail(data.email)
            setNameEnterprice(data.nameEnterprice)


        }


        setEnterpriceFormModal(true)

    }



    // Get Data

    const { data: enterprice, get: getEnterprice, loading } = useFetch(url)

    //Consulta Privilegios

    const allowedPermissions = useAllowedPermissionsAndPrivileges(idToPermissionName, idToPrivilegesName);


    useEffect(() => {
        // Cuando la carga está en progreso (load es true), activamos el modal de carga
        if (enterprice?.enterprice?.length > 0) {
            setTimeout(() => {
                setShowModaload(false);
            }, 700);
        } else {
            setTimeout(() => {
                setShowModaload(false);
            }, 2000);

        }
    }, [enterprice]);

    const statusEnterprice = [
        {
            value: "Activo",
            label: "Activo"
        },
        {
            value: "Inactivo",
            label: "Inactivo"
        }
    ];

    useEffect(() => {

        getEnterprice('enterpricesecurity')

    }, [])


    // Funtionality to search


    const [search, setSearch] = useState('');

    let enterpriceList = filter(search, enterprice?.data?.enterpriseSecurity, "nameEnterprice")

    enterpriceList = enterpriceList.sort((a, b) => a.idEnterpriseSecurity - b.idEnterpriseSecurity);


    const searcher = (e) => {

        setSearch(e.target.value)
        console.log(e.target.value)

    }

    const [shouldValidate, setShouldValidate] = useState(false);
    const updateEnterprice = async (event) => {

        const data = {

            idEnterpriseSecurity: idEnterpriseSecurity,
            nameEnterprice: nameEnterprice,
            email: email,
            NIT: NIT,
            phone: phone,
            address: address,
            state: state

        }

        console.log("edit data", data)

        await postRequest(event, `enterpricesecurity`, 'PUT', setEnterpriceFormModal, data, url, 'Empresa actualizada correctamente')
        setShouldValidate(true)
        getEnterprice('enterpricesecurity')

    };

    const createEnterprice = async (event) => {

        const data = {

            nameEnterprice: nameEnterprice,
            email: email,
            NIT: NIT,
            phone: phone,
            address: address,

        }

        console.log("edit data", data)

        await postRequest(event, 'enterpricesecurity', 'POST', {}, data, url, 'Empresa creada correctamente')
        setEnterpriceFormModal(false)
        setShouldValidate(true)
        getEnterprice('enterpricesecurity')

    };


    //paginator

    const { totalPages, currentPage, nextPage, previousPage, filteredData: EnterpriceInfo } = usePaginator(enterpriceList, 10);



    return (
        <>
            <ContainerTable
                title='Empresas de Seguridad'
                buttonToGo={
                    allowedPermissions['Vigilantes'] && allowedPermissions['Vigilantes'].includes('Crear')
                        ? <ButtonGoTo value='Nueva Empresa' onClick={() => openEnterpriceModal(null)} />
                        : null
                }

                search={<SearchButton value={search} onChange={searcher} placeholder='Buscar Empresa' />}
                showPaginator={
                    <Paginator
                        totalPages={totalPages}
                        currentPage={currentPage}
                        nextPage={nextPage}
                        previousPage={previousPage}
                    />}
            >


                <TablePerson>
                    <Thead>
                        <Th name={'Información Empresa'}></Th>
                        <Th name={'Dirección'}></Th>
                        <Th name={'Teléfono'}></Th>
                        <Th name={'Correo'}></Th>


                        <Th></Th>


                    </Thead>
                    <Tbody>

                        {/* <img className='dontFountData' src={dataNotFoundImg} alt="" srcset="" /> : */}

                        {EnterpriceInfo().map(enterprise => (
                            <Row
                                icon='command'
                                key={enterprise.idEnterpriseSecurity}
                                A3={'NIT'}
                                A4={enterprise.NIT}
                                A1={enterprise.nameEnterprice}
                                status={enterprise.state}
                                A2={''}
                                description={enterprise.address}
                                A7={enterprise.phone}
                                A17={enterprise.email}
                            >
                                <Actions onClick={() => openEnterpriceModal(enterprise)} accion='Editar Empresa' icon="edit" />
                            </Row>
                        ))}

                    </Tbody>
                </TablePerson>

            </ContainerTable >

            {EnterpriceFormModal &&
                createPortal(
                    <>
                        <ModalContainer showModal={setEnterpriceFormModal}>
                            <Modal
                                onClick={IsEditedEnterprice ? updateEnterprice : createEnterprice}
                                showModal={setEnterpriceFormModal}
                                title={IsEditedEnterprice ? `Editar empresa` : 'Crear nueva empresa'}
                            >

                                <Inputs name="NIT" type='number' value={NIT} onChange={e => setNIT(e.target.value)} validate={shouldValidate} required={true}
                                ></Inputs>
                                <Inputs name="Nombre Empresa" type='text' value={nameEnterprice} onChange={e => setNameEnterprice(e.target.value)} validate={shouldValidate} required={true}></Inputs>
                                <Inputs name="Dirección" type='text' value={address} onChange={e => setAddress(e.target.value)} validate={shouldValidate} required={true}></Inputs>
                                <Inputs name="Correo" type='email' value={email} onChange={e => setEmail(e.target.value)} validate={shouldValidate} required={true}
                                ></Inputs>
                                <Inputs name="Teléfono" type='number' value={phone} onChange={e => setPhone(e.target.value)} validate={shouldValidate} required={true}></Inputs>


                                {

                                    IsEditedEnterprice ?
                                        <>
                                            <InputsSelect id={"select"} options={statusEnterprice} name={"Estado"}
                                                value={state} onChange={e => setStatus(e.target.value)}
                                            ></InputsSelect>

                                            <Inputs type={"hidden"}
                                                value={idEnterpriseSecurity} onChange={e => setIdEnterpriseSecurity(e.target.value)}></Inputs>
                                        </>
                                        : null
                                }


                            </Modal>
                        </ModalContainer>
                    </>,
                    document.getElementById("modalRender")
                )}

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
                                <div className="d-flex justify-content-center">
                                    <p> </p>
                                    <p className="mt-2 text-muted">Cargando datos...</p>
                                </div>


                            </Modaload>
                        </ModalContainerload>
                    </>,
                    document.getElementById("modalRender")
                )}


        </>


    )
}
