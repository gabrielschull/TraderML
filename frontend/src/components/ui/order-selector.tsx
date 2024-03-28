'use client';

import { Button } from "./button";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl} from './form';
import { Input } from './input';    
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from './select';


const limitSchema = z.object({
    sentimentTimeToConsider: z.coerce.number().min(0),
    sentimentConfidenceThreshold: z.coerce.number().min(0).max(1),
    buyLimitMultiplier: z.coerce.number().min(0),
    sellLimitMultiplier: z.coerce.number().min(0),
    limitOrderExpiry: z.string(),
    orderType: z.string(),
}) 

const bracketSchema = z.object({
    sentimentTimeToConsider: z.coerce.number().min(0),
    sentimentConfidenceThreshold: z.coerce.number().min(0).max(1),
    bracketBuyTakeProfitMultiplier: z.coerce.number().min(0),
    bracketSellTakeProfitMultiplier: z.coerce.number().min(0),
    bracketBuyStopLossMultiplier: z.coerce.number().min(0),
    bracketSellStopLossMultiplier: z.coerce.number().min(0),
    orderType: z.string(),

})

const marketSchema = z.object({
    sentimentTimeToConsider: z.coerce.number().min(0),
    sentimentConfidenceThreshold: z.coerce.number().min(0).max(1),
    orderType: z.string(),

})

export const OrderSelector = () => {

    const [orderType, setOrderType] = useState<string>('');

    const limitForm = useForm<z.infer<typeof limitSchema>>({
        resolver: zodResolver(limitSchema),
        defaultValues: {
            sentimentTimeToConsider: 3,
            sentimentConfidenceThreshold: 0.999,
            orderType: '',
            buyLimitMultiplier: 1.01,
            sellLimitMultiplier: 0.99,
            limitOrderExpiry: 'day',
        }
    });
    const bracketForm = useForm<z.infer<typeof bracketSchema>>({ 
        resolver: zodResolver(bracketSchema),
        defaultValues: {
            sentimentTimeToConsider: 3,
            sentimentConfidenceThreshold: 0.999,
            orderType: '',
            bracketBuyTakeProfitMultiplier: 1.01,
            bracketSellTakeProfitMultiplier: 0.99,
            bracketBuyStopLossMultiplier: 0.98,
            bracketSellStopLossMultiplier: 1.02,
        }
    });
    const marketForm = useForm<z.infer<typeof marketSchema>>({
        resolver: zodResolver(marketSchema),
        defaultValues: {
            sentimentTimeToConsider: 3,
            sentimentConfidenceThreshold: 0.999,
            orderType: '',
        }
    });



    const handleSubmit = (values: z.infer<typeof limitSchema>) => {
        console.log(values);
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
                <Select onValueChange={(value) => {field.onChange(value); setOrderType(value)}}>
                
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

        {orderType== 'bracket'&& (
        <>
        <FormField control={bracketForm.control} 
        name='sentimentTimeToConsider'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Time To Consider</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Time To Consider" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={bracketForm.control} 
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
        <FormField control={bracketForm.control} 
        name='bracketBuyTakeProfitMultiplier'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Bracket Buy Take Profit Multiplier</FormLabel>
                <FormControl>
                    <Input placeholder="Bracket Buy Take Profit Multiplier" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={bracketForm.control} 
        name='bracketSellTakeProfitMultiplier'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Bracket Sell Take Profit Multiplier</FormLabel>
                <FormControl>
                    <Input placeholder="Bracket Sell Take Profit Multiplier" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={bracketForm.control} 
        name='bracketBuyStopLossMultiplier'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Bracket Buy Stop Loss Multiplier</FormLabel>
                <FormControl>
                    <Input placeholder="Bracket Buy Stop Loss Multiplier" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={bracketForm.control} 
        name='bracketSellStopLossMultiplier'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Bracket Sell Stop Loss Multiplier</FormLabel>
                <FormControl>
                    <Input placeholder="Bracket Sell Stop Loss Multiplier" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />

        </>
        )}

       {orderType== 'limit'&& ( 
       <>
       <FormField control={limitForm.control} 
        name='sentimentTimeToConsider'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Time To Consider</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Time To Consider" {...field}/>
                </FormControl>
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
        </>
        )}
        {orderType== 'market'&& (
        <>
        <FormField control={marketForm.control} 
        name='sentimentTimeToConsider'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className='text-white'>Sentiment Time To Consider</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Time To Consider" {...field}/>
                </FormControl>
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
        </>   
        )}




        <Button variant="default">Run Strategy</Button>
        </form>
        </Form>
      </div>
    </div>
  )

}