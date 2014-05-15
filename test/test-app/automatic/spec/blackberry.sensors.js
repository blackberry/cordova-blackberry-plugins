/*
 * Copyright 2014 BlackBerry Limited.
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

        it('should be able to get an array of supported sensors', function () {
            runs(function () {
                var supportedSensors = blackberry.sensors.supportedSensors;

                expect(supportedSensors.length).toBeGreaterThan(0);
                expect(supportedSensors).toEqual(jasmine.any(Array));

                for (var i = 0; i < supportedSensors.length; i++) {
                    expect(supportedSensors[i]).toEqual(jasmine.any(String));
                }
            });
        });

        it('should be able to activate the deviceaccelerometer sensor and get valid data', function () {
            runs(function () {
                document.addEventListener("deviceaccelerometer", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("deviceaccelerometer", onSensor);
            });
        });

        it('should be able to activate the devicemagnetometer sensor and get valid data', function () {
            runs(function () {
                document.addEventListener("devicemagnetometer", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("devicegyroscope", onSensor);
            });
        });

        it('should be able to activate the devicegyroscope sensor and get valid data', function () {
            runs(function () {
                document.addEventListener("devicegyroscope", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("devicegyroscope", onSensor);
            });
        });

        it('should be able to activate the devicecompass sensor and get valid data', function () {
            runs(function () {
                document.addEventListener("devicecompass", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("devicecompass", onSensor);
            });
        });

        it('should be able to activate the deviceproximity sensor and get valid data', function () {
            runs(function () {
                document.addEventListener("deviceproximity", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("deviceproximity", onSensor);
            });
        });

        it('should be able to activate the devicelight sensor and get valid data', function () {
            runs(function () {
                document.addEventListener("devicelight", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("devicelight", onSensor);
            });
        });

        it('should be able to activate the devicegravity sensor and get valid data', function () {
            runs(function () {
                document.removeEventListener("devicegravity", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("devicegravity", onSensor);
            });
        });

        it('should be able to activate the devicelinearacceleration sensor and get valid data', function () {
            runs(function () {
                document.addEventListener("devicelinearacceleration", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("devicelinearacceleration", onSensor);
            });
        });

        it('should be able to activate the deviceorientation sensor and get valid data', function () {
            runs(function () {
                document.removeEventListener("deviceorientation", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("deviceorientation", onSensor);
            });
        });

        it('should be able to activate the devicerotationmatrix sensor and get valid data', function () {
            runs(function () {
                document.removeEventListener("devicerotationmatrix", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("devicerotationmatrix", onSensor);
            });
        });

        it('should be able to activate the deviceazimuthpitchroll sensor and get valid data', function () {
            runs(function () {
                document.removeEventListener("deviceazimuthpitchroll", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("deviceazimuthpitchroll", onSensor);
            });
        });

        it('should be able to activate the deviceholster sensor and get valid data', function () {
            runs(function () {
                document.removeEventListener("deviceholster", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                document.removeEventListener("deviceholster", onSensor);
            });
        });
    });
});

