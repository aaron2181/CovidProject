import React from 'react'

const NavBar = () => {

  return (
    <div>
      <nav className="navbar navbar-expand-md bg-primary navbar-dark">
        <div class="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src={ require("../statics/images/image_86x60.png") }
              alt="Logo" style={ { width: '80px' } }
            >
            </img>

            <b className="ml-2" style={ { fontSize: '1.35em' } }>
              COVID-19 Detection
            </b>
          </a>

          
          <div className="navbar-collapse justify-content-end">
            {/* <a href='/' className="text-white">
              <span style={ { textDecoration: 'underline' } }>
                Create Account or Login
              </span>
            </a> */}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
