'use client';

import { Button } from "./button";
import { ComboboxDemo } from "./order-popover";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl} from './form';
import { Input } from './input';    
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from './select';


const limitSchema = z.object({
    sentimentConfidenceThreshold: z.coerce.number().min(0).max(1),
    buyLimitMultiplier: z.coerce.number().min(0),
    sellLimitMultiplier: z.coerce.number().min(0),
    limitOrderExpiry: z.string(),
    orderType: z.string(),
}) 

export const OrderSelector = () => {
    const limitForm = useForm<z.infer<typeof limitSchema>>({
        resolver: zodResolver(limitSchema),
        defaultValues: {
            sentimentConfidenceThreshold: 0.999,
            orderType: '',
            buyLimitMultiplier: 1.01,
            sellLimitMultiplier: 0.99,
            limitOrderExpiry: 'day',
        }
    });

    const handleSubmit = (values: z.infer<typeof limitSchema>) => {
        const parsedValues = {
            ...values,
            sentimentConfidenceThreshold: Number(values.sentimentConfidenceThreshold),
            buyLimitMultiplier: Number(values.buyLimitMultiplier),
            sellLimitMultiplier: Number(values.sellLimitMultiplier),
        };
        console.log('parsedValues:', parsedValues);
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex text-2xl text-white mb-16" aria-label="Order Selector" role="heading">
        Choose & customize your order type, then run your strategy
      </div>
      <div>
        <Form {...limitForm}>
        <form onSubmit={limitForm.handleSubmit(handleSubmit)} className= "max-w-md w-full flex flex-col gap-4">
        <FormField control={limitForm.control} 
        name='orderType'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel>Order Type</FormLabel>
                <Select onValueChange={field.onChange}>
                
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder='Select an order type'/>
                    </SelectTrigger>
                </FormControl>
                    <SelectContent>
                        <SelectItem value='bracket'>Bracket</SelectItem>
                        <SelectItem value='limit'>Limit</SelectItem>
                        <SelectItem value='market'>Market</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage/>
                
            </FormItem>
            )
        }}
        />
        <FormField control={limitForm.control} 
        name='sentimentConfidenceThreshold'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Confidence Threshold</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Confidence Threshold" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={limitForm.control} 
        name='buyLimitMultiplier'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Buy Limit Multiplier</FormLabel>
                <FormControl>
                    <Input placeholder="Buy Limit Multiplier" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={limitForm.control} 
        name='sellLimitMultiplier'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className='text-white'>Sell Limit Multiplier</FormLabel>
                <FormControl>
                    <Input placeholder="Sell Limit Multiplier" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <Button variant="default">Run Strategy</Button>
        </form>
        </Form>
      </div>
    </div>
  )

}