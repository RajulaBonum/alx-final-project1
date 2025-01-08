import React, { useEffect, useState } from 'react'
import api from '../apis/api'

const useProductData = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(function(){
        setLoading(true)
        api.get("products")
        .then(res => {
            console.log(res.data)
            setProducts(res.data)
            setLoading(false)
        })
        .catch(err => {
            console.log(err.message)
        })
    }, [])


  return {products, loading, setProducts, setLoading}
    
}

export default useProductData