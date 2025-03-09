import React from 'react';

const ParamInput = ({props, text}) => {
    return (
        <div className="input-group">
            <label>{text}</label>
            <input type="text" className="input_style" {...props} />
        </div>
    );
};

export default ParamInput;