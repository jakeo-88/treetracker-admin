import { init } from "@rematch/core";
import planters from "./planters";
import * as loglevel from "loglevel";
import api from "../api/planters";
import FilterPlanter from "./FilterPlanter";

jest.mock("../api/planters");

const log = loglevel.getLogger("../models/planter.test");

describe("planter", () => {
  //{{{
  let store;
  let planter = {
    name: "OK",
  };
  let filter;

  beforeEach(() => {
  });

  describe("with a default store", () => {
    //{{{
    beforeEach(async () => {
      store = init({
        models: {
          planters,
        },
      });
      //set page size
      expect(store.getState().planters.pageSize).toBe(21);
      await store.dispatch.planters.changePageSize({ pageSize: 1 });
      expect(store.getState().planters.pageSize).toBe(1);
    });

    it("check initial state", () => {
      expect(store.getState().planters.planters).toBeInstanceOf(Array);
      expect(store.getState().planters.planters).toHaveLength(0);
      expect(store.getState().planters.filter).toBeInstanceOf(FilterPlanter);
    });

    describe("load(1) ", () => {
      beforeEach(async () => {
        api.getPlanters.mockReturnValue([planter]);
        filter = new FilterPlanter({
          personId: 1,
        });
        const result = await store.dispatch.planters.load({
          pageNumber: 1,
          filter,
        });
        expect(result).toBe(true);
      });

      it("should get some trees", () => {
        expect(store.getState().planters.planters).toHaveLength(1);
      });

      it("should call api with param: skip = 0", () => {
        expect(api.getPlanters).toHaveBeenCalledWith({
          skip: 0,
          rowsPerPage: 1,
          filter: filter,
        });
      });

      it("currentPage should be 1", () => {
        expect(store.getState().planters.currentPage).toBe(1);
      });

      it("Sould have filter be set to store", () => {
        expect(store.getState().planters.filter).toBe(filter);
      });

      describe("load(2)", () => {
        beforeEach(async () => {
          api.getPlanters.mockReturnValue([planter]);
          const result = await store.dispatch.planters.load({
            pageNumber: 2,
            filter,
          });
          expect(result).toBe(true);
        });

        it("should get some trees", () => {
          expect(store.getState().planters.planters).toHaveLength(1);
        });

        it("should call api with param: skip = 1", () => {
          expect(api.getPlanters).toHaveBeenCalledWith({
            skip: 1,
            rowsPerPage: 1,
            filter,
          });
        });
      });

      describe("count()", () => {

        beforeEach(async () => {
          api.getCount.mockReturnValue(2);
          expect(await store.dispatch.planters.count()).toBe(true);
        });

        it("Should get count = 2, page count = 2", async () => {
          expect(store.getState().planters.count).toBe(2);
          expect(store.getState().planters.pageCount).toBe(2);
        });

      });
    });
  });
});
