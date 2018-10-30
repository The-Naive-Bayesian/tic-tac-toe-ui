import * as React from 'react';

const Square = ({icon, onClick}) => {
    return (
        <div className={"square"} onClick={onClick}>
            {
                icon
                ? (
                    <svg>
                        <circle r={'45%'} cx={'50%'} cy={'50%'} fill={icon.fill} />
                    </svg>
                )
                : null
            }
        </div>
    );
};

export default Square;