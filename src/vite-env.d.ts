/// <reference types="vite/client" />
import { Eip1193Provider } from "@ethersproject/providers"; 
declare global { interface Window { ethereum?: Eip1193Provider; } }