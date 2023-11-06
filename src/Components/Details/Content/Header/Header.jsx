/* eslint-disable react/prop-types */

export const Header = ({ children }) => {
    return (
        <div className="container">

            <div className="row mt-5 align-items-center table-responsive">
                {children}
            </div>
        </div>
        )
}
