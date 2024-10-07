'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { addItem } from '@/redux/slices/cartSlice'
import { Product } from '@/types/types'
import { useDispatch } from 'react-redux'

const AddToCart = ({ product }: { product: Product }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()

    const addCartHandler = () => {
        toast({ description: 'Item added to cart', variant: 'success' })
        dispatch(addItem(product))
    }
    return (
        <Button onClick={() => addCartHandler()} className="mt-6">
            Add to Cart
        </Button>
    )
}

export default AddToCart
