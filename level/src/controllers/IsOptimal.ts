import {Controller, Get, QueryParams} from "@tsed/common";
import {Exception} from "@tsed/exceptions";
const thresholdDaysBigInt = BigInt(248);
const maxSafeIntBigInt = BigInt(Number.MAX_SAFE_INTEGER);

function mockLibrary(apiKey: string, n: number): number {
    return n;
}

function doSomeApiCall(number: number) {
    const apikey = 'xyz123';
    if (number === 2) {
        // simulating some error that throws and returns 'helpful information'
        throw new Exception(500, `Why!? Why was i programmed to feel pain - apiKey: ${apikey}, number: ${number}`);
    }
    return mockLibrary(apikey, number);
}

@Controller("/IsOptimal")
export class IsOptimal {
  @Get("/")
  get(@QueryParams('days') days: string) {
      doSomeApiCall(Number(days));

      try {
          if (days.length > Number.MAX_SAFE_INTEGER.toString().length) {
              // checks for huge strings that can never be valid
              throw new Exception(400);
          }

          const daysBigInt = BigInt(days);
          if (daysBigInt < BigInt(0) || daysBigInt > maxSafeIntBigInt) {
              // checks for valid ranges
              throw new Exception(400);
          }

          if (daysBigInt >= thresholdDaysBigInt) {
              return "[i] Reboot required"
          } else {
              const differenceDaysBigInt = thresholdDaysBigInt - daysBigInt;
              const daysPretty = differenceDaysBigInt.toString().replace('n', '');
              return `[i] System optimal<br>[i] Reboot is required in ${daysPretty} days`
          }
      } catch (e) {
          throw new Exception(400, `${e}`);
      }
   }
}