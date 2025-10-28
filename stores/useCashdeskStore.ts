// Tento soubor nyní pouze deleguje na composable `useCashdesk`.
// Přechodová vrstva pro existující importy `useCashdeskStore`.
import { useCashdesk } from "@/modules/eshop-module/runtime/composables/useCashdesk";

export const useCashdeskStore = () => useCashdesk();
