import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import { useAllowedPermissionsAndPrivileges, useFetchForFile, useFetchget } from '../../Hooks/useFetch';
import { createPortal } from 'react-dom';
import { Uploader } from '../../Components/Uploader/Uploader';
import { dotSpinner } from 'ldrs'
import { ContainerTable } from '../../Components/ContainerTable/ContainerTable';
import { ButtonGoTo, DropdownExcel, SearchButton, SearchSelect } from '../../Components/Buttons/Buttons';
import { TablePerson } from '../../Components/Tables/Tables';
import { Thead } from '../../Components/Thead/Thead';
import { Th } from '../../Components/Th/Th';
import { Tbody } from '../../Components/Tbody/Tbody';
import { ModalContainerload, Modaload } from '../../Components/Modals/Modal';
import { Row } from '../../Components/Rows/Row';
import { Actions } from '../../Components/Actions/Actions';
import { Modal, ModalContainer } from '../../Components/Modals/ModalTwo';
import { set } from 'date-fns';
import { useApiUpdate } from '../../Hooks/FetchputDan';
import ImageContainer from '../../Components/ImgContainer/imageContainer';
import Cookies from 'js-cookie';
import { idToPermissionName, idToPrivilegesName } from '../../Hooks/permissionRols';
import FileUploader from '../../Components/ImgContainer/FileSelector';
import Inputs from '../../Components/Inputs/Inputs';
import { Spinner } from '../../Components/Spinner/Spinner';
import { fineTypes } from '../../Hooks/consts.hooks';
import { usePaginator, useUserLogged } from '../../Helpers/Helpers';
import { NotificationsAlert } from '../../Components/NotificationsAlert/NotificationsAlert';
import { Paginator } from '../../Components/Paginator/Paginator';



function Fines() {
    const [LoadingSpiner, setLoadingSpiner] = useState(true);
    //Se crea un estado para actualizar los datos al momento de cualquier accion
    const [fines, setFines] = useState({ fines: [] })
    const [showModaload, setShowModaload] = useState(false);
    // const [search, setSearch] = useState('');
    dotSpinner.register()
    const [showModal, setShowModal] = useState(false);
    const [evidenceFiles, setEvidenceFiles] = useState();
    const [paymentproof, setPaymentproof] = useState();
    const [paymentprooftoSend, setPaymentprooftoSend] = useState();
    const [showevidences, setShowEvidences] = useState(true);
    const [id, setId] = useState();
    const [filterParam, setfilterParam] = useState('incidentDate');
    const [selectedFilterValue, setSelectedFilterValue] = useState('');
    const [originalFines, setOriginalFines] = useState([]);

    const { data, load, error } = useFetchget('fines')

    const { idUserLogged, idRolLogged } = useUserLogged()

    const { data: dataRols, loadRols, errorRols } = useFetchget('rols');

    const nameRole = dataRols?.rols?.find(rol => rol.idrole === idRolLogged)?.namerole;

    const filterOptions = [{ label: 'Fecha incidente', value: "incidentDate" },
    { label: 'Fecha límite de pago', value: 'paymentDate' },
    // { label: 'Fecha de creación', value: "createdAt" },
    { label: 'Estado', value: "state" },
    { label: 'Tipo de multa', value: "fineType" },
    { label: 'Apartamento', value: "apartmentName" }
    ]
    const [optionState, setOptionState] = useState('pendiente');
    const typeOptions = [{ label: 'Pendiente', value: 'pendiente' }, { label: 'Por revisar', value: 'por revisar' }, { label: 'Pagada', value: 'pagada' }]
    // const [dateOption, setDateOption] = useState('incidentDate');
    const dateOptions = [{ label: 'Fecha incidente', value: 'incidentDate' }, { label: 'Fecha limite de pago', value: 'paymentDate' }, { label: 'Fecha de creacion', value: 'createdAt' }]
    const [dateMarked, setDateMarked] = useState("date");
    useEffect(() => {
        // Cuando la carga está en progreso (load es true), activamos el modal de carga
        if (data?.fines?.length > 0) {
            setLoadingSpiner(false);
        } else {
            setTimeout(() => { setLoadingSpiner(false) }, 10000);
            // Cuando la carga se completa (load es false), desactivamos el modal de carga

        }
    }, [data]);
    //se usa el effect para actualizar los datos del get
    useEffect(() => {
        if (data && data.fines) {
            setFines(reorderFines(data.fines));
            setOriginalFines(reorderFines(data.fines));
        }
    }, [data]);

    function handleChange(e) {
        console.log("hola console1")
        setSelectedFilterValue(e.target.value);
        searcher(e.target.value, filterParam);
    }

    function handleChange2(e) {
        setfilterParam(e.target.value);
        if (e.target.value == "apartmentName") {
            searcher("");
        } else if ((e.target.value == "incidentDate" || e.target.value == "paymentDate" || e.target.value == "createdAt") && isNaN(Date.parse(selectedFilterValue))) {
            searcher("", e.target.value);

        } else {
            searcher(selectedFilterValue, e.target.value);
        }

    }

    function handleChange3(e) {
        handleChange2(e);

        setfilterParam(e.target.value);
        if (e.target.value == "incidentDate"
            || e.target.value == "paymentDate"
            || e.target.value == "createdAt"
        ) { setDateMarked('date') } else { setDateMarked('text'), setSelectedFilterValue('') }
    }

    function searcher(searchValue, filterParam) {

        console.log("valor de busqueda", searchValue, "valor de filtro", filterParam)
        let filteredFines = originalFines.filter((dato) => {
            if (filterParam === "incidentDate") {
                return dato.incidentDate.toString().toLowerCase()
                    .includes(searchValue?.target?.value != undefined ? searchValue.target.value.toLowerCase() : searchValue)
            }
            if (filterParam === "paymentDate") {
                return dato.paymentDate.toString().toLowerCase()
                    .includes(searchValue?.target?.value != undefined ? searchValue.target.value.toLowerCase() : searchValue)
            }
            // if (filterParam === "createdAt") {
            //     return dato.createdAt.toString().toLowerCase()
            //     .includes(searchValue?.target?.value != undefined  ? searchValue.target.value.toLowerCase() : searchValue)
            // }
            if (filterParam === "state") {
                return dato.state.toString().toLowerCase().includes(searchValue.toLowerCase())
            }
            if (filterParam === "fineType") {
                return dato.fineType.toString().toLowerCase().includes(searchValue.toLowerCase())
            }
            if (filterParam === "apartmentName") {
                return dato.apartment.apartmentName.toString().toLowerCase().includes(searchValue.toLowerCase())
            }
            if (searchValue === "") {
                return originalFines;
            }
        })
        console.log("lo que encontre", filteredFines.length, filteredFines)
        setFines(filteredFines);

    }



    function reorderFines(fines) {
        return fines.sort((a, b) => {
            // Primero, las multas "Por aprobar"
            if (a.state === "Por aprobar" && b.state !== "Por aprobar") return -1;
            if (a.state !== "Por aprobar" && b.state === "Por aprobar") return 1;

            // Si ambos son "Por aprobar", comparar por fecha
            if (a.state === "Por aprobar" && b.state === "Por aprobar") {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            }

            // Luego, las multas "Pendiente"
            if (a.state === "Pendiente" && b.state !== "Pendiente") return -1;
            if (a.state !== "Pendiente" && b.state === "Pendiente") return 1;

            // Si ambos son "Pendiente", comparar por fecha
            if (a.state === "Pendiente" && b.state === "Pendiente") {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            }

            // Finalmente, las multas "Pagada"
            if (a.state === "Pagada" && b.state !== "Pagada") return 1;
            if (a.state !== "Pagada" && b.state === "Pagada") return -1;

            // Si ambos son "Pagada", comparar por fecha
            if (a.state === "Pagada" && b.state === "Pagada") {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            }
        })
    }

    //se crea una funcion para el boton que hara la accion de actualizar y se le pasa como parametro los datos que se van a actualizar
    const handleEditClick = async (dataToUpdate) => {
        setShowModaload(true);

        //se llama a la funcion useApiUpdate y se le pasa como parametro los datos que se van a actualizar y el endpoint
        let response = await useFetchForFile(`${import.meta.env.VITE_API_URL}fines`, dataToUpdate, 'PUT')
        // .then((responseData) => {

        // console.log("respuesta de api holi", response)
        if (response.response != null) {
            setShowModaload(false);
            Swal.fire({
                icon: 'success',
                title: 'Archivo actualizado',
                showConfirmButton: false,
                timer: 1500
            })
            //se crea una constante que va a actualizar los datos para que en el momento que se actualice el estado se actualice la tabla
            const updatedfine = fines.map((fine) => {
                console.log("entre pero no encontrado", fine)
                console.log("id buscado", dataToUpdate.idFines, "idActual", fine.idFines)
                console.log("datos respuesta", response.response)
                if (fine.idFines == dataToUpdate.idfines) {
                    if (dataToUpdate.paymentproof) {
                        fine.paymentproof = response.response.results.paymentproof;
                    }
                    // console.log("Encontrado! ", fine, "id", fine.idFines)
                    fine.state = dataToUpdate.state;
                }

                return fine;

            });
            console.log("registro actualizado: ", updatedfine)
            setFines(updatedfine);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Actualizacion fallida',
                text: 'Debes adjuntar un archivo y debe ser de extension jpeg, jpg, png o pdf',
            });
            setShowModaload(false);
        }


    };

    const {totalPages, currentPage, nextPage, previousPage, filteredData: filteredDataFines}= usePaginator(fines, 4)


    // const totalPages = fines ? Math.ceil(fines.length / 8) : 0;
    // const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);


    // const [currentPage, setCurrentPage] = useState(0);

    // const filteredDatafines = () => {
    //     if (nameRole && (nameRole.toLowerCase().includes('vigilante') || nameRole.toLowerCase().includes('seguridad') || nameRole.toLowerCase().includes('vigilancia'))) {
    //         if (data && data.fines && fines.length > 0) {
    //             const userFines = fines.filter(fine => fine.iduser === idUserLogged);
    //             return userFines?.slice(currentPage * 8, currentPage * 8 + 8);
    //         } else {
    //             return [];
    //         }
    //     } else {
    //         if (data && data.fines && fines.length > 0) {
    //             return fines?.slice(currentPage * 8, currentPage * 8 + 8);
    //         } else {
    //             return [];
    //         }
    //     }
    // };



    //Consulta Privilegios

    const allowedPermissions = useAllowedPermissionsAndPrivileges(idToPermissionName, idToPrivilegesName);


    return (
        <>
            <ContainerTable title='Multas'
                dropdown={nameRole ? (nameRole.toLowerCase().includes('vigilante') || nameRole.toLowerCase().includes('seguridad') || nameRole.toLowerCase().includes('vigilancia') ? null : <DropdownExcel table='fines' />) : <DropdownExcel table='fines' />}


                search2={<SearchSelect options={filterOptions} onChange={handleChange3} />}
                search={filterParam == "state" ? <SearchButton options={typeOptions} type={dateMarked} onChange={handleChange} />
                    : filterParam == "fineType" ? <SearchButton options={fineTypes} onChange={handleChange} /> : <SearchButton value={selectedFilterValue} type={dateMarked} onChange={handleChange} placeholder='Buscar multa' />}
                buttonToGo={
                    allowedPermissions['Multas'] && allowedPermissions['Multas'].includes('Crear')
                        ? <ButtonGoTo value='Crear Multa' href='/admin/fines/create' />
                        : null
                }
                showPaginator={
                  <Paginator totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} previousPage={previousPage}></Paginator>
                }
            >
                <TablePerson>
                    <Thead>

                        <Th name={'Tipo de multa'}></Th>
                        <Th name={'Fecha del incidente'}></Th>
                        <Th name={'Fecha limite de pago'}></Th>
                        <Th name={'Valor a pagar'}></Th>
                        <Th name={'Estado'}></Th>
                        <Th name={'Acciones'}></Th>
                    </Thead>
                    <Tbody>
                        {LoadingSpiner == true ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', position: 'fixed', left: '52%', top: '45%', transform: 'translate(-50%, -24%)' }}>
                            <Spinner />
                        </div> : filteredDataFines()?.map(fine => (
                            <Row
                                key={fine.idFines}
                                A1={fine.fineType}
                                A3="APTO"
                                A4={fine.apartment?.apartmentName}
                                icon='file-plus'
                                // status='Pendiente'
                                A6={(() => {
                                    let incidentDate = new Date(fine.incidentDate).toLocaleDateString('es-ES', {
                                        timeZone: 'UTC',
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    });
                                    return incidentDate;
                                })()}
                                A7={(() => {
                                    let paymentDate = new Date(fine.paymentDate).toLocaleDateString('es-ES', {
                                        timeZone: 'UTC',
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    });
                                    return paymentDate;
                                })()}
                                A9={"$" + fine.amount}
                                A12={fine.state}
                                to={`details/${fine.idFines}`}
                            >
                                {
                                    fine.state != 'Pagada'
                                        ?
                                        (
                                            nameRole && !nameRole.toLowerCase().includes('seguridad') && !nameRole.toLowerCase().includes('vigilancia') && !nameRole.toLowerCase().includes('vigilante')
                                                ?
                                                <Actions accion='Agregar Comprobante' onClick={() => {
                                                    setShowEvidences(false);
                                                    setId(fine.idFines);
                                                    console.log("Comprobante de pago1", fine.paymentproof);

                                                    setPaymentproof([fine.paymentproof]);
                                                    console.log("Comprobante de pago2", paymentproof);
                                                    setShowModal(true)
                                                }} />
                                                :
                                                ""
                                        )
                                        :
                                        ""
                                }

                                {
                                    fine.paymentproof != null && fine.state != 'Pagada'
                                        ?
                                        (
                                            nameRole && !nameRole.toLowerCase().includes('seguridad') && !nameRole.toLowerCase().includes('vigilancia') && !nameRole.toLowerCase().includes('vigilante')
                                                ?
                                                <>
                                                    <Actions accion='Aprobar pago' onClick={() => {
                                                        handleEditClick({ idfines: fine.idFines, state: 'Pagada' });
                                                    }} />
                                                </>
                                                :
                                                null
                                        )
                                        :
                                        ""
                                }

                                <Actions accion='Ver Evidencias'
                                    // href={`/admin/fines/details/${fine.idFines}`}
                                    onClick={() => {
                                        setShowEvidences(true);
                                        setEvidenceFiles(fine.evidenceFiles);
                                        setShowModal(true);
                                    }
                                    }
                                />
                            </Row>
                        ))}


                    </Tbody>
                </TablePerson>
            </ContainerTable>
            {showModal &&
                createPortal(
                    <>
                        <ModalContainer ShowModal={setShowModal}>
                            <Modal
                                showModal={setShowModal}
                                onClick={() => { setShowModal(false), handleEditClick({ idUserLogged: idUserLogged, idfines: id, state: "Por revisar", paymentproof: paymentprooftoSend }) }}
                                title={showevidences ? "Evidencias" : "Comprobante de pago"}
                                onClickClose={() => { setEvidenceFiles([]); setPaymentproof([]) }}
                                showSave={showevidences ? false : true}
                            >
                                {
                                    showevidences ?
                                        <ImageContainer urls={evidenceFiles} />
                                        :
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <ImageContainer urls={paymentproof} />
                                            <div style={{ width: "200px", height: "200px" }}>
                                                <Uploader label={"Agregar archivo"}
                                                    onChange={(e) => {
                                                        setPaymentprooftoSend(e.target.files[0]);
                                                    }}
                                                />
                                            </div>


                                        </div>

                                }
                            </Modal>
                        </ModalContainer>
                    </>,
                    document.getElementById("modalRender")
                )

            }
            // {showModaload &&
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


                            </Modaload>
                        </ModalContainerload>
                    </>,
                    document.getElementById("modalRender")
                )}

        </>
    )
}

export default Fines