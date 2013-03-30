/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe("blackberry.sensors", function () {
    describe("sensors", function () {
        var onSensor = jasmine.createSpy(),
            waitForTimeout = 5000;

        beforeEach(function () {
            waits(1000);
        });

        it('should be able to get a list of supported sensors', function () {
            runs(function () {
                expect(blackberry.sensors.supportedSensors).toContain("devicecompass");
            });
        });

        it('should be able to activate the deviceaccelerometer sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("deviceaccelerometer", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("deviceaccelerometer", onSensor);
            });
        });

        it('should be able to activate the devicemagnetometer sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("devicemagnetometer", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("devicegyroscope", onSensor);
            });
        });

        it('should be able to activate the devicegyroscope sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("devicegyroscope", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("devicegyroscope", onSensor);
            });
        });

        it('should be able to activate the devicecompass sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("devicecompass", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("devicecompass", onSensor);
            });
        });

        it('should be able to activate the deviceproximity sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("deviceproximity", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("deviceproximity", onSensor);
            });
        });

        it('should be able to activate the devicelight sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("devicelight", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("devicelight", onSensor);
            });
        });

        it('should be able to activate the devicegravity sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("devicegravity", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("devicegravity", onSensor);
            });
        });

        it('should be able to activate the devicelinearacceleration sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("devicelinearacceleration", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("devicelinearacceleration", onSensor);
            });
        });

        it('should be able to activate the deviceorientation sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("deviceorientation", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("deviceorientation", onSensor);
            });
        });

        it('should be able to activate the devicerotationmatrix sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("devicerotationmatrix", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("devicerotationmatrix", onSensor);
            });
        });

        it('should be able to activate the deviceazimuthpitchroll sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("deviceazimuthpitchroll", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("deviceazimuthpitchroll", onSensor);
            });
        });

        it('should be able to activate the deviceholster sensor and get valid data', function () {
            runs(function () {
                window.addEventListener("deviceholster", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                window.removeEventListener("deviceholster", onSensor);
            });
        });
    });
});

