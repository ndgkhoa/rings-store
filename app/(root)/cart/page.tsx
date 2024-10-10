'use client'

import PayPalButton from '@/components/Helper/PayPalButton'
import { Button } from '@/components/ui/button'
import { addItem, clearCart, removeItem } from '@/redux/slices/cartSlice'
import { RootState } from '@/redux/store'
import { CartItem } from '@/types/types'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

const Cart = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const items = useSelector((state: RootState) => state.cart.items)
    const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0,
    )
    const totalPrice = items
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2)
    const vat = (+totalPrice * 0.15).toFixed(2)
    const totalPriceWithVat = (+totalPrice + +vat).toFixed(2)

    const { user } = useUser()

    const addItemHandler = (item: CartItem) => {
        dispatch(addItem(item))
    }

    const removeItemHandler = (id: string) => {
        dispatch(removeItem({ id }))
    }

    const handleSuccess = (details: any) => {
        router.push('/success')
        dispatch(clearCart())
    }

    return (
        <div className="mt-8 min-h-[60vh]">
            {items.length == 0 && (
                <div className="flex items-center w-full h-[80vh] flex-col justify-center">
                    <Image
                        src="/cart.svg"
                        alt="empty_cart"
                        width={400}
                        height={400}
                        className="object-cover mx-auto"
                    />
                    <h1 className="mt-8 text-2xl font-semibold">
                        Your cart is empty
                    </h1>
                    <Link href="/">
                        <Button className="mt-4">Shop now</Button>
                    </Link>
                </div>
            )}
            {items.length > 0 && (
                <div className="md:w-4/5 w-[95%] mx-auto grid grid-cols-1 xl:grid-cols-6 gap-12">
                    <div className="rounded-lg shadow-md overflow-hidden xl:col-span-4">
                        <h1 className="p-4 text-xl sm:text-2xl md:text-3xl font-bold text-white bg-blue-800">
                            Your cart ({totalQuantity} items)
                        </h1>
                        {items.map((item) => (
                            <div key={item._id}>
                                <div className="flex pb-6 mt-2 p-5 border-b-[1.5px] border-opacity-25 border-gray-700 items-center space-x-10">
                                    <div>
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={180}
                                            height={180}
                                        />
                                    </div>
                                    <div>
                                        <h1 className="md:text-xl text-base font-bold text-black">
                                            {item.title}
                                        </h1>
                                        <h1 className="md:text-lg text-sm font-semibold">
                                            Category : {item.category}
                                        </h1>
                                        <h1 className="md:text-2xl text-lg font-bold text-blue-950">
                                            {item.price}
                                        </h1>
                                        <h1 className="md:text-lg text-sm font-semibold">
                                            Quantity : {item.quantity}
                                        </h1>
                                        <div className="flex items-center mt-4 space-x-2">
                                            <Button
                                                onClick={() =>
                                                    addItemHandler(item)
                                                }
                                            >
                                                Add more
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    removeItemHandler(item._id)
                                                }
                                                variant={'destructive'}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="xl:col-span-2">
                        <div className="bg-indigo-950 sticky top-[25vh] p-6 rounded-lg">
                            <h1 className="text-center mt-8 mb-8 text-white text-3xl font-semibold">
                                Summary
                            </h1>
                            <div className="w-full h-[1.2px] bg-white bg-opacity-20"></div>
                            <div className="flex mt-4 text-xl uppercase font-semibold text-white items-center justify-between">
                                <span>Subtotal</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex mt-10 mb-10 text-xl uppercase font-semibold text-white items-center justify-between">
                                <span>VAT</span>
                                <span>${vat}</span>
                            </div>
                            <div className="flex mb-6 text-xl uppercase font-semibold text-white items-center justify-between">
                                <span>Shipping</span>
                                <span>free</span>
                            </div>
                            <div className="w-full h-[1.2px] bg-white bg-opacity-20"></div>
                            <div className="flex mt-6 mb-6 text-xl uppercase font-semibold text-white items-center justify-between">
                                <span>Total</span>
                                <span>${totalPriceWithVat}</span>
                            </div>
                            {!user && (
                                <Link href="/sign-in">
                                    <Button className="w-full bg-orange-500">
                                        Sign in to Checkout
                                    </Button>
                                </Link>
                            )}
                            {user && (
                                // <Button className="w-full bg-orange-500">
                                //     Paypal
                                // </Button>
                                <PayPalButton
                                    amount={totalPriceWithVat}
                                    onSuccess={handleSuccess}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart
