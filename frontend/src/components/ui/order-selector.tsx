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
    sentiment_time_to_consider: z.coerce.number().min(0),
    sentiment_confidence_threshold: z.coerce.number().min(0).max(1),
    buy_limit_multiplier: z.coerce.number().min(0),
    sell_limit_multiplier: z.coerce.number().min(0),
    limit_order_expiry: z.string(),
    order_type: z.string(),
    symbol: z.string(),
}) 

const bracketSchema = z.object({
    sentiment_time_to_consider: z.coerce.number().min(0),
    sentiment_confidence_threshold: z.coerce.number().min(0).max(1),
    bracket_buy_take_profit_multiplier: z.coerce.number().min(0),
    bracket_sell_take_profit_multiplier: z.coerce.number().min(0),
    bracket_buy_stop_loss_multiplier: z.coerce.number().min(0),
    bracket_sell_stop_loss_multiplier: z.coerce.number().min(0),
    order_type: z.string(),
    symbol: z.string(),

})

const marketSchema = z.object({
    sentiment_time_to_consider: z.coerce.number().min(0),
    sentiment_confidence_threshold: z.coerce.number().min(0).max(1),
    order_type: z.string(),
    symbol: z.string(),

})

export const OrderSelector = () => {

    const [order_type, setorder_type] = useState<string>('');

    const limitForm = useForm<z.infer<typeof limitSchema>>({
        resolver: zodResolver(limitSchema),
        defaultValues: {
            sentiment_time_to_consider: 3,
            sentiment_confidence_threshold: 0.999,
            order_type: 'limit',
            buy_limit_multiplier: 1.01,
            sell_limit_multiplier: 0.99,
            limit_order_expiry: 'day',
            symbol: 'SPY',
        }
    });
    const bracketForm = useForm<z.infer<typeof bracketSchema>>({ 
        resolver: zodResolver(bracketSchema),
        defaultValues: {
            sentiment_time_to_consider: 3,
            sentiment_confidence_threshold: 0.999,
            order_type: 'bracket',
            bracket_buy_take_profit_multiplier: 1.01,
            bracket_sell_take_profit_multiplier: 0.99,
            bracket_buy_stop_loss_multiplier: 0.98,
            bracket_sell_stop_loss_multiplier: 1.02,
            symbol: 'SPY',
        }
    });
    const marketForm = useForm<z.infer<typeof marketSchema>>({
        resolver: zodResolver(marketSchema),
        defaultValues: {
            sentiment_time_to_consider: 3,
            sentiment_confidence_threshold: 0.999,
            order_type: 'market',
            symbol: 'SPY',
        }
    });

    
    
    
    const handleSubmit = async (values: any) => {
        console.log('values:', values);
        try {
            const response = await fetch('http://localhost:8000/update_params', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update parameters');
            }
            const data = await response.json(); 
            console.log('data:', data);
    
            // Start the bot
            const startResponse = await fetch('http://localhost:8000/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
    
            if (!startResponse.ok) {
                throw new Error('Failed to start the bot');
            }
            const startData = await startResponse.json(); 
            console.log('startData:', startData);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    // Function to get the current form and its submit handler based on order_type
    const getOrderForm = () => {
        switch (order_type) {
            case 'limit':
                return limitForm;
            case 'bracket':
                return bracketForm;
            case 'market':
                return marketForm;
            default:
                
                return bracketForm;
        }
    };
    
    const currentForm = getOrderForm();


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex text-2xl text-white mb-16" aria-label="Order Selector" role="heading">
        Choose & customize your order type, then run your strategy
      </div>
      <div>
        <Form {...(currentForm as any)}>
        <form onSubmit={currentForm.handleSubmit(handleSubmit)} className= "max-w-md w-full flex flex-col gap-4">
        <FormField control={(currentForm as any).control} 
        name='order_type'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel>Order Type</FormLabel>
                <Select onValueChange={(value) => {field.onChange(value); setorder_type(value)}}>
                
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

        {order_type== 'bracket'&& (
        <>
        <FormField control={bracketForm.control} 
        name='sentiment_time_to_consider'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Time To Consider In Days</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Time To Consider" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={bracketForm.control} 
        name='sentiment_confidence_threshold'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Confidence Threshold, 0 - 0.999</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Confidence Threshold" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={bracketForm.control} 
        name='bracket_buy_take_profit_multiplier'
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
        name='bracket_sell_take_profit_multiplier'
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
        name='bracket_buy_stop_loss_multiplier'
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
        name='bracket_sell_stop_loss_multiplier'
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
        <FormField control={bracketForm.control} 
        name='symbol'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Stock Symbol To Buy And Compare</FormLabel>
                <FormControl>
                    <Input placeholder="Stock Symbol" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />

        </>
        )}

       {order_type== 'limit'&& ( 
       <>
       <FormField control={limitForm.control} 
        name='sentiment_time_to_consider'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Time To Consider In Days</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Time To Consider" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={limitForm.control} 
        name='sentiment_confidence_threshold'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Confidence Threshold, 0 - 0.999</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Confidence Threshold" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={limitForm.control} 
        name='buy_limit_multiplier'
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
        name='sell_limit_multiplier'
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
        <FormField control={limitForm.control} 
        name='symbol'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Stock Symbol To Buy And Compare</FormLabel>
                <FormControl>
                    <Input placeholder="Stock Symbol" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        </>
        )}
        {order_type== 'market'&& (
        <>
        <FormField control={marketForm.control} 
        name='sentiment_time_to_consider'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className='text-white'>Sentiment Time To Consider In Days</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Time To Consider" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={marketForm.control} 
        name='sentiment_confidence_threshold'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Sentiment Confidence Threshold, 0 - 0.999</FormLabel>
                <FormControl>
                    <Input placeholder="Sentiment Confidence Threshold" {...field}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
            )
        }}
        />
        <FormField control={marketForm.control} 
        name='symbol'
        render={({field}) => {
            return ( <FormItem>
                <FormLabel className="text-white">Stock Symbol To Buy And Compare</FormLabel>
                <FormControl>
                    <Input placeholder="Stock Symbol" {...field}/>
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