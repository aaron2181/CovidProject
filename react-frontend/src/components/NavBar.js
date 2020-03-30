import React from 'react'

const NavBar = () => {

  return (
    <div>
      <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
        <a className="navbar-brand">
          <img
            src={ require("../statics/images/image_86x60.png") }
            alt="Logo" style={ { width: '80px' } }
          >
          </img>
        </a>

        <h3 className="text-white">COVID-19 Detection</h3>
        
        {/* <div className="navbar-collapse justify-content-end">
          <a href='/' className="text-white">
            <span style={ { textDecoration: 'underline' } }>
              Create Account or Login
            </span>
          </a>
        </div> */}
      </nav>
    </div>
  )
}

export default NavBar
