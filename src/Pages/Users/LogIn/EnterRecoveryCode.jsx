import './LogIn.css';
import ImageIcono from '../../../assets/Logo-Apptower.png';
import ImagenPerson from '../../../assets/Person.jpg';
import { InputsLogIn } from '../../../Components/Inputs/InputsLogIn';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

export const EnterRecoveryCode = () => {
    const [recoveryCode, setRecoveryCode] = useState('');
    const [verifiedRecoveryCode, setVerifiedRecoveryCode] = useState(null);
    const [showModaload, setShowModaload] = useState(false);
    const [error, setError] = useState([{}]);
    console.log(recoveryCode);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowModaload(true);


        try {
            const response = await fetch('http://localhost:3000/api/email/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recoveryCode: recoveryCode }),
            });

            const data = await response.json();
            console.log('data:', data);

            console.log('response.status:', response.status);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Éxito',
                    text: data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => navigate('/resetpassword'));

                setVerifiedRecoveryCode(recoveryCode);
            } else {
                if (data.errors && data.errors.length > 0) {
                    setError(data.errors);
                    Swal.fire('Error', data.errors[0].message, 'error');
                } else {
                    Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
                }
            }

            setShowModaload(false);

        } catch (error) {
            Swal.fire('Error', 'Ocurrió un error al verificar el código', 'error');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    return (
        <div className='container-login'>
            <div className="container-form login">
                <div className="informations">
                    <div className="info-childs">
                        {/* <img src={ImageIcono} width="140" height="140" alt="ApptowerApart" /> */}
                        <h2>Bienvenido</h2>
                        <p className='message'>Recupera tu contraseña de forma segura con un código de verificación enviado a tu correo</p>
                    </div>
                </div>
                <div className="form-informations">
                    <div className="form-information-childs">
                        <img src={ImagenPerson} width="75" height="75" alt="" />

                        <form className="form" onSubmit={handleSubmit}>

                            <InputsLogIn placeholder='Codigo' errors={error} identifier={'recoveryCode'} type='text' value={recoveryCode} onChange={(newValue) => setRecoveryCode(newValue)} onKeyPress={handleKeyPress} />


                            <button className='boton-login' type='submit' disabled={showModaload}>
                                {showModaload ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validando...
                                    </>
                                ) : (
                                    <>
                                        Validar Código
                                    </>
                                )}
                            </button><br />
                            <Link to="/recoverpassword" class="buttonStyle" id="sign-up">Regresar</Link>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )

}