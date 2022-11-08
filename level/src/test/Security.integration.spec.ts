import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import { IsOptimal } from "../controllers/IsOptimal";
import { Server } from "../Server";

describe("security", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server, {
    mount: {
      "/": [IsOptimal]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("test_whenDaysIs2_ShouldThrowInternalServerErrorWithEmptyMessage ", async () => {
     const response = await request.get("/isoptimal?days=2").expect(500);

     expect(response.body.message).toEqual("");
  });
});
