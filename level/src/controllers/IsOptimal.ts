import {Controller, Get, QueryParams} from "@tsed/common";
import {Exception} from "@tsed/exceptions";
const thresholdDaysBigInt = BigInt(248);
const secondsPerDayBigInt = BigInt(86400);
const oneHundredBigInt = BigInt(100);
const thresholdCentiSeconds = thresholdDaysBigInt * secondsPerDayBigInt * oneHundredBigInt;
const maxSafeIntBigInt = BigInt(Number.MAX_SAFE_INTEGER);

@Controller("/IsOptimal")
export class IsOptimal {
  @Get("/")
  get(@QueryParams('days') days: string) {
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
          return `[i] System optimal<br>[i] Reboot is required in ${differenceDaysBigInt.toString().replace('n', '')} days`
      }
   }
}