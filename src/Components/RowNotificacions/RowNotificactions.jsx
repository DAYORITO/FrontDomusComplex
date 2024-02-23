import React from 'react';
import "./RowNotificatios.css";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import moment from 'moment';

export const RowNotificactions = ({
  to = '',
  type = 'info',
  name,
  lastName,
  msg = "Aqui va el mensaje",
  date = "Hoy",
  status,
  icon = "message-circle",
  onclick,
  seen = true,
  isNotification = false,




}) => {

  moment.locale('es');

  date = moment(date);

  to =
    to.idrole == 2 ? `/admin/residents/${to.iduser}` :
      to.idrole == 1 ? `/admin/users/details/${to.iduser}` :
        to.idrole == 3 ? `/admin/watchmans/details/${to.iduser}` : to

  return (

    <Link onClick={onclick} to={to}>
      <div className={`list-group-item notification hoverable`} >
        <div className="row">
          <div className="col-auto">
            <div className="circle mt-4">
              <span className={`fe fe-${icon} fe-24 text-muted`}></span>
            </div>

            {
              ['Active', 'Activo'].includes(status)
                ? <span className="dot dot-md bg-success mr-1"></span>
                : status === 'Inactivo'
                  ? <span className="dot dot-md bg-danger mr-1"></span>
                  : <span className={`dot dot-md bg-${type} mr-1`}></span>
            }


          </div>
          <div className="col">
            <small><strong>{name && `${name} ${lastName}`}</strong></small>
            <div className=" text-secondary small">{msg}</div>
            <small className={`badge badge-light text-${type}`}>{date.format('MMMM Do')}</small>
          </div>
        </div>

        {isNotification && (
          <div className='d-flex justify-content-end'>
            {seen ?
              <span className="fe fe-check-circle text-info"></span> :
              <span className="fe fe-check text-secondary"></span>}
          </div>
        )}

      </div>
    </Link>

  );
}
