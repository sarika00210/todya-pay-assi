import React, { useState } from 'react';
import Button from './Button';
import ConfettiExplosion from 'react-confetti-explosion';
import { MdOutlineDarkMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";


const Calculator = () => {
  const [memory, setMemory] = useState(null);
  const [input, setInput] = useState('');
  const [displayedInput, setDisplayedInput] = useState('');
  const [result, setResult] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState([]);

  //handle clicking on the button and updating the input and displayed input
  const handleClick = (value) => {
    setInput(input + value);
    setDisplayedInput(displayedInput + value);
  };
 
  //handle clearing the input and displayed input
  const handleClear = () => {
    setInput('');
    setDisplayedInput('');
    setResult('');
  };
 
  //balance the parentheses in the input  
  const balanceParentheses = (input) => {
    let opened = 0;
    let closed = 0;

    for (let char of input) {
      if (char === '(') opened++;
      if (char === ')') closed++;
    }

    if (opened > closed) {
      return input + ')'.repeat(opened - closed);
    } else {
      return input;
    }
  };
  
  //trigonometric functions in degrees
  const sinDegrees = (degrees) => Math.sin(degrees * (Math.PI / 180));
  const cosDegrees = (degrees) => Math.cos(degrees * (Math.PI / 180));
  const tanDegrees = (degrees) => Math.tan(degrees * (Math.PI / 180));


  //calculate the result of the input
  const handleCalculate = () => {
    try {
      let correctedInput = balanceParentheses(input);

      //parse the input and replace trigonometric functions with their respective functions
      let parsedInput = correctedInput
        .replace(/(\d+)sin\((\d+)\)/g, '($1 * ' + (isRadians ? 'Math.sin' : 'sinDegrees') + '($2))')
        .replace(/(\d+)cos\((\d+)\)/g, '($1 * ' + (isRadians ? 'Math.cos' : 'cosDegrees') + '($2))')
        .replace(/(\d+)tan\((\d+)\)/g, '($1 * ' + (isRadians ? 'Math.tan' : 'tanDegrees') + '($2))')
        .replace(/ln/g, 'Math.log')
        .replace(/(\d+)\s*(Math\.\w+)/g, '$1*$2')
        .replace(/(\))(\d+)/g, '$1*$2')
        .replace(/(\d+)(\()/g, '$1*$2');
      console.log(parsedInput);
      const calculatedResult = eval(parsedInput);
      setInput(calculatedResult);
      setDisplayedInput(calculatedResult);
      setResult(calculatedResult);

      //check if the input contains 5 and 6 and set the confetti to true
      if (input.includes('5') && input.includes('6')) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }

      //add the input and result to the history
      setHistory([...history, { input, result: calculatedResult }]);
    } catch (error) {
      setResult('Error');
    }
  };
  
  //handle trigonometric functions
  const handleTrigFunction = (func) => {
    setInput('1' + input + func + '(');
    setDisplayedInput(displayedInput + func + '(');
  };
  
  //calculate the factorial of a number
  const factorial = (n) => (n === 0 ? 1 : n * factorial(n - 1));
  
  //handle the logic for the memory buttons
  const handleMemory = (action) => {
    switch (action) {
      case 'MC':
        setMemory(null);
        break;
      case 'M+':
        setMemory(parseFloat(input));
        break;
      case 'M-':
        setMemory(memory !== null ? memory - parseFloat(input) : parseFloat(input));
        break;
      case 'MR':
        setInput(memory !== null ? String(memory) : '');
        setDisplayedInput(memory !== null ? String(memory) : '');
        break;
      default:
        break;
    }
  };

  //handling the logic for advance scientific buttons
  const handleAdvancedFunction = (func) => {
    switch (func) {
      case 'x^2':
        setInput(`Math.pow(${input}, 2)`);
        setDisplayedInput(displayedInput + '^2');
        break;
      case 'x^3':
        setInput(`Math.pow(${input}, 3)`);
        setDisplayedInput(displayedInput + '^3');
        break;
      case 'x^y':
        setInput(input + '**');
        setDisplayedInput(displayedInput + '^');
        break;
      case 'e^x':
        setInput(`Math.exp(${input})`);
        setDisplayedInput('e^' + displayedInput);
        break;
      case '10^x':
        setInput(`Math.pow(10, ${input})`);
        setDisplayedInput(displayedInput + '^10');
        break;
      case '1/x':
        setInput(`1/(${input})`);
        setDisplayedInput('1/(' + displayedInput + ')');
        break;
      case '2√x':
        setInput(`Math.sqrt(${input})`);
        setDisplayedInput('√' + displayedInput);
        break;
      case '3√x':
        setInput(`Math.cbrt(${input})`);
        setDisplayedInput('∛' + displayedInput);
        break;
      case 'y√x':
        setInput(input + '**(1/');
        setDisplayedInput(displayedInput + '√');
        break;
      case 'x!':
        setInput(`factorial(${input})`);
        setDisplayedInput(displayedInput + '!');
        break;
      case 'e':
        setInput('Math.E');
        setDisplayedInput(displayedInput + 'e');
        break;
      case 'EE':
        setInput(input + 'e');
        setDisplayedInput(displayedInput + 'e');
        break;
      case 'Rad':
        setIsRadians(!isRadians);
        break;
      case 'sinh':
        setInput(`Math.sinh(${input})`);
        setDisplayedInput(displayedInput + 'sinh');
        break;
      case 'cosh':
        setInput(`Math.cosh(${input})`);
        setDisplayedInput(displayedInput + 'cosh');
        break;
      case 'tanh':
        setInput(`Math.tanh(${input})`);
        setDisplayedInput(displayedInput + 'tanh');
        break;
      case 'π':
        setInput('Math.PI');
        setDisplayedInput(displayedInput + 'π');
        break;
      case 'Rand':
        setInput('Math.random()');
        setDisplayedInput(displayedInput + 'Rand');
        break;
      default:
        break;
    }
  };

  return (
    <div>
    <div className={`min-w-64 bg-white ${isDarkMode ? ' text-white bg-zinc-900' : 'bg-white text-black'} rounded-lg shadow-lg p-6 w-128 relative mt-5`}>
      {confetti && <ConfettiExplosion />}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 rounded-md bg-zinc-500 text-white"
        >
          {isDarkMode ? <MdOutlineDarkMode fontSize='large'/> : <MdDarkMode fontSize='large'/>}
        </button>
      </div>
      <div className={`rounded-lg p-4 mb-4 h-16 ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
        <div className="text-2xl">{displayedInput}</div>
      </div>
      <div className='flex flex-col sm:flex-row gap-3 min-w-64'>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 min-w-64">
            <Button value={isRadians ? "Rad" : "Deg"} onClick={() => handleAdvancedFunction('Rad')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="x^2" onClick={() => handleAdvancedFunction('x^2')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="x^3" onClick={() => handleAdvancedFunction('x^3')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="x^y" onClick={() => handleAdvancedFunction('x^y')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="10^x" onClick={() => handleAdvancedFunction('10^x')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="2√x" onClick={() => handleAdvancedFunction('2√x')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="3√x" onClick={() => handleAdvancedFunction('3√x')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="y√x" onClick={() => handleAdvancedFunction('y√x')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="x!" onClick={() => handleAdvancedFunction('x!')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="sin" onClick={() => handleTrigFunction('sin')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="cos" onClick={() => handleTrigFunction('cos')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="tan" onClick={() => handleTrigFunction('tan')} className="col-span-1 bg-zinc-500 text-white" />   
            <Button value="sinh" onClick={() => handleAdvancedFunction('sinh')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="cosh" onClick={() => handleAdvancedFunction('cosh')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="tanh" onClick={() => handleAdvancedFunction('tanh')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="e^x" onClick={() => handleAdvancedFunction('e^x')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="1/x" onClick={() => handleAdvancedFunction('1/x')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="EE" onClick={() => handleAdvancedFunction('EE')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="π" onClick={() => handleAdvancedFunction('π')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="Rand" onClick={() => handleAdvancedFunction('Rand')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="e" onClick={() => handleAdvancedFunction('e')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="MC" onClick={() => handleMemory('MC')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="M+" onClick={() => handleMemory('M+')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="M-" onClick={() => handleMemory('M-')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="MR" onClick={() => handleMemory('MR')} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="2nd" onClick={() => setIsRadians(!isRadians)} className="col-span-1 bg-zinc-500 text-white" />
            <Button value="history" onClick={() => console.log(history)} className="col-span-1 bg-zinc-500 text-white" />
            </div>
            <div className="grid grid-cols-4 gap-2 min-w-64">
                <Button value="AC" onClick={handleClear} className="col-span-1 bg-zinc-500 text-white" />
                <Button value="(" onClick={() => handleClick('(')} className="col-span-1 bg-zinc-500 text-white" />
                <Button value=")" onClick={() => handleClick(')')} className="col-span-1 bg-zinc-500 text-white" />
                <Button value="/" onClick={() => handleClick('/')} className="col-span-1 bg-orange-500 text-white" />
                <Button value="7" onClick={() => handleClick('7')} className="col-span-1 bg-zinc-300" />
                <Button value="8" onClick={() => handleClick('8')} className="col-span-1 bg-zinc-300" />
                <Button value="9" onClick={() => handleClick('9')} className="col-span-1 bg-zinc-300" />
                <Button value="*" onClick={() => handleClick('*')} className="col-span-1 bg-orange-500 text-white" />
                <Button value="4" onClick={() => handleClick('4')} className="col-span-1 bg-zinc-300" />
                <Button value="5" onClick={() => handleClick('5')} className="col-span-1 bg-zinc-300" />
                <Button value="6" onClick={() => handleClick('6')} className="col-span-1 bg-zinc-300" />
                <Button value="-" onClick={() => handleClick('-')} className="col-span-1 bg-orange-500 text-white" />
                <Button value="1" onClick={() => handleClick('1')} className="col-span-1 bg-zinc-300" />
                <Button value="2" onClick={() => handleClick('2')} className="col-span-1 bg-zinc-300" />
                <Button value="3" onClick={() => handleClick('3')} className="col-span-1 bg-zinc-300" />
                <Button value="+" onClick={() => handleClick('+')} className="col-span-1 bg-orange-500 text-white" />
                <Button value="0" onClick={() => handleClick('0')} className="col-span-2 bg-zinc-300" />
                <Button value="." onClick={() => handleClick('.')} className="col-span-1 bg-zinc-300" />
                <Button value="=" onClick={handleCalculate} className="col-span-1 bg-orange-500 text-white" />   
            </div>
        </div>
    </div>
    <div className="bg-zinc-900 p-4 mt-5 mb-5">
    <div className="grid grid-row gap-4">
        {history.map((item, index) => (
            <div key={index} className="flex flex-col items-center bg-zinc-700 p-2 rounded-lg shadow-md">
                <div className='text-gray-400 text-md font-medium'>{item.input}</div>
                <div className='text-white text-lg'>{item.result}</div>
            </div>
        ))}
    </div>
</div>

        </div>
  );
};

export default Calculator;

