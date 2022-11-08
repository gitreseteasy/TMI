import {Controller, Get, QueryParams} from "@tsed/common";
import {Exception} from "@tsed/exceptions";
const thresholdDaysBigInt = BigInt(248);
const maxSafeIntBigInt = BigInt(Number.MAX_SAFE_INTEGER);

function mockLibrary(apiKey: string, n: number): number {
    return n;
}

function doSomeApiCall(number: number) {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        // We throw here if we haven't set the API key instead of hardcoding it
        throw new Exception(500);
    }

    if (number === 2) {
        // simulating some error that throws
        throw new Exception(500);
    }
    return mockLibrary(apiKey, number);
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