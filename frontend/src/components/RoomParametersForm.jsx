import React from 'react';
import ParamInput from './ParamInput';

const RoomParametersForm = () => {
    return (
        <form className="param-form">
            <h1>Интерактивный конфигуратор</h1>
            <div className="right-container">
                <ParamInput text="Площадь помещения (м²):" />
                <ParamInput text="Кол-во людей:" />
                <ParamInput text="Назначение помещения:" />
                <button className="bt-find">Найти</button>
            </div>
            <div className="left-container">

            </div>
        </form>
    );
};

export default RoomParametersForm;