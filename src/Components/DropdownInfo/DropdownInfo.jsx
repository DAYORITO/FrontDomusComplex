import React, { useState } from 'react';
import { DropdownExcel } from '../Buttons/Buttons';
import "./DropdownInfo.css";
import { Link } from 'react-router-dom';
import { Dropdownanchor2 } from '../DropDownAnchor/Dropdownanchor';

export const DropdownInfo = ({

    name,
    action1,
    toAction1 = "",
    onClickAction1,
    action2,
    toAction2,
    onClickAction2,
    children,
    initiallyOpen = true

}) => {
    const [isAccordionOpen, setAccordionOpen] = useState(initiallyOpen);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleAccordion = () => {
        setAccordionOpen(!isAccordionOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="myCard" >
            <div className={`card-header ${isDropdownOpen ? 'active' : ''}`} >
                <a role="button" onClick={toggleAccordion}>
                    <strong>{name}</strong>

                </a>
                <div className={`dropdown ${isDropdownOpen ? 'show' : ''}`}>
                    {action1 &&
                        <>
                            <button className="btn btn-sm dropdown-toggle more-vertical" type="button" onClick={toggleDropdown}>
                                <span className="sr-only"></span>
                            </button>

                            <div className={`dropdown-menu dropdown-menu-right  ${isDropdownOpen ? 'show' : ''}`}>
                                {
                                    action1 ? <Link onClick={onClickAction1} className="dropdown-item" to={toAction1}>
                                        {action1}
                                    </Link> : null
                                }

                                {

                                    action2 ? <Link onClick={onClickAction2} className="dropdown-item" to={toAction2}>
                                        {action2}
                                    </Link> : null
                                }


                            </div>
                        </>

                    }
                </div>
            </div>
            <div className={`collapse ${isAccordionOpen ? 'show' : ''}`}>
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );
};



export const Accions = ({
    action1,
    toAction1 = "",
    onClickAction1,
    action2,
    toAction2,
    onClickAction2,
    style
}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!isDropdownOpen);
    };

    const handleClickAction1 = (e) => {
        e.stopPropagation();
        if (onClickAction1) {
            onClickAction1(e);
        }
    };

    const handleClickAction2 = (e) => {
        e.stopPropagation();
        if (onClickAction2) {
            onClickAction2(e);
        }
    };

    return (
        <div className={`dropdown ${isDropdownOpen ? 'show' : ''}`} style={style}>
            <button className="btn btn-sm dropdown-toggle more-vertical" type="button" onClick={toggleDropdown}>
                <span className="sr-only"></span>
            </button>

            <div className={`dropdown-menu dropdown-menu-right  ${isDropdownOpen ? 'show' : ''}`}>
                {action1 ? <Link onClick={handleClickAction1} className="dropdown-item" to={toAction1}>
                    {action1}
                </Link> : null}

                {action2 ? <Link onClick={handleClickAction2} className="dropdown-item" to={toAction2}>
                    {action2}
                </Link> : null}
            </div>
        </div>
    );
};