var expect = chai.expect;

describe("BusParkingSimulatorTest", function() {
	describe("test for validateInputCommand", function() {
		it("validate input command test 1", () => {
		    expect(validateInputCommand("PLACE 0,0,NORTH")).to.equal(true);
		});
		
		it("validate input command test 2", () => {
		    expect(validateInputCommand("PLACE 0,0,0")).to.equal(false);
		});
		
		it("validate input command test 3", () => {
		    firstCommand = false;
		    expect(validateInputCommand("MOVE")).to.equal(true);
		});
		
		it("validate input command test 4", () => {
		    firstCommand = false;
		    expect(validateInputCommand("LEFT")).to.equal(true);
		});
		
		it("validate input command test 5", () => {
		    firstCommand = false;
		    expect(validateInputCommand("RIGHT")).to.equal(true);
		});
		
		it("validate input command test 6", () => {
		    firstCommand = false;
		    expect(validateInputCommand("aaaaa")).to.equal(false);
		});
	});
	
	describe("test for splitPlaceCommand", function() {
		it("split place command test 1", () => {
		    expect(splitPlaceCommand("PLACE 0,0,NORTH")).to.have.property('command');
			expect(splitPlaceCommand("PLACE 0,0,NORTH")).to.have.property('inputPositions');
		});
		
		it("split place command test 2", () => {
		    expect(splitPlaceCommand("PLACE")).to.equal(undefined);
		});
	});
	
	describe("test for bus", function() {
		it("bus test 1", () => {
		    expect(bus).to.have.property('place');
			expect(bus).to.have.property('move');
			expect(bus).to.have.property('left');
			expect(bus).to.have.property('right');
			expect(bus).to.have.property('report');
		});
	});
	
	describe("test for executeCommand", function() {
		it("execute command test 1", () => {
		    expect(executeCommand("PLACE 0,0,NORTH")).to.equal(true);
		});
		
		it("execute command test 2", () => {
		    expect(executeCommand("PLACE")).to.equal(undefined);
		});
	});
});