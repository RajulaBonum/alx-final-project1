import React, { useState } from 'react'
import CircleLoader from 'react-spinners/CircleLoader'


const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Spinner = ({loading}) => {
    let [color, setColor] = useState("#F08700")

  return (
    <CircleLoader 
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
  )
}

export default Spinner