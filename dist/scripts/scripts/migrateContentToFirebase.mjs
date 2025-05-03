var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
// Initialize Firebase Admin
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
var app = initializeApp({
    credential: cert(serviceAccount)
});
var db = getFirestore(app);
function migrateCourses() {
    return __awaiter(this, void 0, void 0, function () {
        var coursesDir, courseFiles, _i, courseFiles_1, file, coursePath, courseData, courseWithMetadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    coursesDir = path.join(__dirname, '../static/content/courses');
                    courseFiles = fs.readdirSync(coursesDir);
                    _i = 0, courseFiles_1 = courseFiles;
                    _a.label = 1;
                case 1:
                    if (!(_i < courseFiles_1.length)) return [3 /*break*/, 4];
                    file = courseFiles_1[_i];
                    if (!file.endsWith('.json')) return [3 /*break*/, 3];
                    coursePath = path.join(coursesDir, file);
                    courseData = JSON.parse(fs.readFileSync(coursePath, 'utf-8'));
                    courseWithMetadata = __assign(__assign({}, courseData), { metadata: __assign(__assign({}, courseData.metadata), { createdAt: new Date(), updatedAt: new Date(), isPublished: true }) });
                    // Store in Firestore
                    return [4 /*yield*/, db.collection('courses').doc(courseData.id).set(courseWithMetadata)];
                case 2:
                    // Store in Firestore
                    _a.sent();
                    console.log("Migrated course: ".concat(courseData.title));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function migrateExercises() {
    return __awaiter(this, void 0, void 0, function () {
        var exercisesDir, exerciseFiles, _i, exerciseFiles_1, file, exercisePath, exerciseData, exerciseWithMetadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exercisesDir = path.join(__dirname, '../static/content/exercises');
                    exerciseFiles = fs.readdirSync(exercisesDir);
                    _i = 0, exerciseFiles_1 = exerciseFiles;
                    _a.label = 1;
                case 1:
                    if (!(_i < exerciseFiles_1.length)) return [3 /*break*/, 4];
                    file = exerciseFiles_1[_i];
                    if (!file.endsWith('.json')) return [3 /*break*/, 3];
                    exercisePath = path.join(exercisesDir, file);
                    exerciseData = JSON.parse(fs.readFileSync(exercisePath, 'utf-8'));
                    exerciseWithMetadata = __assign(__assign({}, exerciseData), { metadata: __assign(__assign({}, exerciseData.metadata), { createdAt: new Date(), updatedAt: new Date(), isPublished: true }) });
                    // Store in Firestore
                    return [4 /*yield*/, db.collection('exercises').doc(exerciseData.id).set(exerciseWithMetadata)];
                case 2:
                    // Store in Firestore
                    _a.sent();
                    console.log("Migrated exercise: ".concat(exerciseData.title));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var coursesSnapshot, exercisesSnapshot, batch_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 8]);
                    console.log('Starting content migration...');
                    // Clear existing data
                    console.log('Clearing existing data...');
                    return [4 /*yield*/, db.collection('courses').get()];
                case 1:
                    coursesSnapshot = _a.sent();
                    return [4 /*yield*/, db.collection('exercises').get()];
                case 2:
                    exercisesSnapshot = _a.sent();
                    batch_1 = db.batch();
                    coursesSnapshot.docs.forEach(function (doc) { return batch_1.delete(doc.ref); });
                    exercisesSnapshot.docs.forEach(function (doc) { return batch_1.delete(doc.ref); });
                    return [4 /*yield*/, batch_1.commit()];
                case 3:
                    _a.sent();
                    // Migrate new data
                    return [4 /*yield*/, migrateCourses()];
                case 4:
                    // Migrate new data
                    _a.sent();
                    return [4 /*yield*/, migrateExercises()];
                case 5:
                    _a.sent();
                    console.log('Content migration completed successfully!');
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error during migration:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 7:
                    process.exit(0);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
main();
