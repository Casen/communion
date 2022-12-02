var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let callbackName = (0, import_isbot.default)(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, {
        context: remixContext,
        url: request.url
      }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 24,
        columnNumber: 7
      }, this),
      {
        [callbackName]: () => {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: (error) => {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_node3 = require("@remix-run/node"), import_react2 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-JGGSEDOM.css";

// app/session.server.ts
var import_node2 = require("@remix-run/node"), import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_supabase_js = require("@supabase/supabase-js"), import_tiny_invariant = __toESM(require("tiny-invariant")), supabaseUrl = process.env.SUPABASE_URL, supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
(0, import_tiny_invariant.default)(
  supabaseUrl,
  "SUPABASE_URL must be set in your environment variables."
);
(0, import_tiny_invariant.default)(
  supabaseAnonKey,
  "SUPABASE_ANON_KEY must be set in your environment variables."
);
var supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseAnonKey);
async function createUser(email, password) {
  let { data: { user } } = await supabase.auth.signUp({
    email,
    password
  });
  return await getProfileByEmail(user == null ? void 0 : user.email);
}
async function getProfileById(id) {
  let { data, error } = await supabase.from("profiles").select("email, id").eq("id", id).single();
  if (error)
    return null;
  if (data)
    return { id: data.id, email: data.email };
}
async function getProfileByEmail(email) {
  let { data, error } = await supabase.from("profiles").select("email, id").eq("email", email).single();
  if (error)
    return null;
  if (data)
    return data;
}
async function verifyLogin(email, password) {
  let { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return error ? void 0 : await getProfileByEmail(user == null ? void 0 : user.email);
}

// app/session.server.ts
(0, import_tiny_invariant2.default)(
  process.env.SESSION_SECRET,
  "SESSION_SECRET must be set in your environment variables."
);
var sessionStorage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !1
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getProfileById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node2.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node2.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// app/root.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), links = () => [{ rel: "stylesheet", href: tailwind_default }], meta = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1"
});
async function loader({ request }) {
  return (0, import_node3.json)({
    user: await getUser(request)
  });
}
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
    lang: "en",
    className: "h-full",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 35,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Links, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 36,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 34,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
        className: "h-full",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 39,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 40,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 42,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 38,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}

// app/routes/api/enneagram.ts
var enneagram_exports = {};
__export(enneagram_exports, {
  loader: () => loader2
});
var import_node4 = require("@remix-run/node");

// lib/enneagram.ts
var calculate = (birthday) => {
  let remainder = 0, sumResult = 0;
  for (; birthday != 0; )
    remainder = birthday % 10, sumResult += remainder, birthday = Math.floor(birthday / 10);
  return sumResult > 9 ? calculate(sumResult) : sumResult;
};

// lib/chart.ts
var import_swisseph = __toESM(require("swisseph"));

// lib/utils.ts
var zodiacArr = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"], zodiacMap = /* @__PURE__ */ new Map();
zodiacArr.forEach((name, idx) => {
  zodiacMap.set(idx + 1, { position: idx + 1, name });
});
var getSignDetails = (position) => zodiacMap.get(position) || { position: 0, name: "unknown" }, planetaryBodies = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
  "MeanNode",
  "TrueNode",
  "MeanApog",
  "OscuApog",
  "Earth",
  "Chiron"
], planetMap = /* @__PURE__ */ new Map();
planetaryBodies.forEach((body, idx) => {
  planetMap.set(idx, { position: idx, body });
});

// lib/chart.ts
var computeChart = () => {
  let date = { year: 1986, month: 4, day: 8, hour: 20.2 }, location = { lat: 33.8807, lon: -117.8553 }, iFlag = import_swisseph.default.SEFLG_SPEED | import_swisseph.default.SEFLG_MOSEPH | import_swisseph.default.SEFLG_SIDEREAL;
  import_swisseph.default.swe_set_sid_mode(import_swisseph.default.SE_SIDM_LAHIRI, 0, 0);
  let tjd = import_swisseph.default.swe_julday(date.year, date.month, date.day, date.hour, import_swisseph.default.SE_GREG_CAL), te = tjd + import_swisseph.default.swe_deltat(tjd).delta, data = import_swisseph.default.swe_houses_ex(te, iFlag, location.lat, location.lon, "P"), ascSign = getSignDetails(Math.floor(data.ascendant / 30) + 1), houses = [];
  for (let i = 0; i < 12; i++) {
    let housePos = i + ascSign.position;
    housePos > 12 && (housePos = housePos - 12);
    let sign = getSignDetails(housePos);
    houses.push({ sign: housePos, planets: [] });
  }
  planetaryBodies.slice(0, 7).forEach((body, idx) => {
    let result = import_swisseph.default.swe_calc_ut(tjd, idx, iFlag), sign = getSignDetails(Math.floor(result.longitude / 30) + 1);
    console.log(`${body} in ${sign.name} ${sign.position}`);
    let house = houses.find((house2) => house2.sign === sign.position);
    house && house.planets.push(idx);
  });
  let rahu = import_swisseph.default.swe_calc_ut(tjd, 11, iFlag).longitude, ketu = rahu + 180, rahuSign = getSignDetails(Math.floor(rahu / 30) + 1), rahuHouse = houses.find((house) => house.sign === rahuSign.position);
  rahuHouse && rahuHouse.planets.push(11);
  let ketuSign = getSignDetails(Math.floor(ketu / 30) + 1), ketuHouse = houses.find((house) => house.sign === ketuSign.position);
  return ketuHouse && ketuHouse.planets.push(12), houses;
};

// app/routes/api/enneagram.ts
var loader2 = async (req) => (0, import_node4.json)(
  {
    enneagram: calculate(12141986),
    birth_chart: computeChart()
  }
);

// app/routes/birth-chart.tsx
var birth_chart_exports = {};
__export(birth_chart_exports, {
  default: () => BirthChart
});
var import_react3 = require("@remix-run/react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function BirthChart() {
  let astro = (0, import_react3.useFetcher)();
  return console.log(astro.data), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" },
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
        children: "Birth Chart Test"
      }, void 0, !1, {
        fileName: "app/routes/birth-chart.tsx",
        lineNumber: 11,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(astro.Form, {
        method: "get",
        action: "/api/enneagram",
        autoComplete: "off",
        role: "presentation",
        children: [
          astro.data ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: astro.data.error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
              children: "Failed to load birth chart :("
            }, void 0, !1, {
              fileName: "app/routes/birth-chart.tsx",
              lineNumber: 16,
              columnNumber: 15
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
              children: [
                "Enneagram: ",
                astro.data.enneagram
              ]
            }, void 0, !0, {
              fileName: "app/routes/birth-chart.tsx",
              lineNumber: 18,
              columnNumber: 15
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/birth-chart.tsx",
            lineNumber: 14,
            columnNumber: 11
          }, this) : null,
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
            type: "submit",
            children: "Get Chart"
          }, void 0, !1, {
            fileName: "app/routes/birth-chart.tsx",
            lineNumber: 24,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/birth-chart.tsx",
        lineNumber: 12,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/birth-chart.tsx",
    lineNumber: 10,
    columnNumber: 5
  }, this);
}

// app/routes/city-search.tsx
var city_search_exports = {};
__export(city_search_exports, {
  default: () => CitySearch
});
var import_react4 = require("@remix-run/react"), import_react5 = require("react"), import_lodash = __toESM(require("lodash.debounce")), import_react6 = require("react"), import_react7 = require("@headlessui/react"), import_solid = require("@heroicons/react/20/solid"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function CitySearch() {
  var _a;
  let [selected, selectCity] = (0, import_react6.useState)(), [query, setQuery] = (0, import_react6.useState)(""), cities = (0, import_react4.useFetcher)(), search = (event) => {
    console.log("searching cities"), cities.submit(event.target.form);
  }, debouncedSearch = (0, import_react5.useMemo)(
    () => (0, import_lodash.default)(search, 300),
    []
  );
  return (0, import_react5.useEffect)(() => () => {
    debouncedSearch.cancel();
  }), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "fixed top-16 w-72",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(cities.Form, {
      method: "get",
      action: "/api/cities",
      autoComplete: "off",
      role: "presentation",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Combobox, {
        value: selected,
        onChange: selectCity,
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "relative mt-1",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Combobox.Input, {
                  name: "q",
                  placeholder: "Los Angeles",
                  className: "w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0",
                  displayValue: (city) => city ? `${city == null ? void 0 : city.name}, ${city == null ? void 0 : city.regionCode}, ${city == null ? void 0 : city.countryCode}` : "",
                  onChange: debouncedSearch
                }, void 0, !1, {
                  fileName: "app/routes/city-search.tsx",
                  lineNumber: 47,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Combobox.Button, {
                  className: "absolute inset-y-0 right-0 flex items-center pr-2",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_solid.MagnifyingGlassIcon, {
                    className: "h-5 w-5 text-gray-400",
                    "aria-hidden": "true"
                  }, void 0, !1, {
                    fileName: "app/routes/city-search.tsx",
                    lineNumber: 55,
                    columnNumber: 15
                  }, this)
                }, void 0, !1, {
                  fileName: "app/routes/city-search.tsx",
                  lineNumber: 54,
                  columnNumber: 13
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/city-search.tsx",
              lineNumber: 46,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Transition, {
              as: import_react6.Fragment,
              leave: "transition ease-in duration-100",
              leaveFrom: "opacity-100",
              leaveTo: "opacity-0",
              afterLeave: () => setQuery(""),
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Combobox.Options, {
                className: "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                children: [
                  (!cities.data || ((_a = cities.data) == null ? void 0 : _a.length) === 0) && query !== "" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "relative cursor-default select-none py-2 px-4 text-gray-700",
                    children: "Nothing found."
                  }, void 0, !1, {
                    fileName: "app/routes/city-search.tsx",
                    lineNumber: 70,
                    columnNumber: 17
                  }, this) : null,
                  cities.state === "submitting" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "relative cursor-default select-none py-2 px-4 text-gray-700",
                    children: "Loading..."
                  }, void 0, !1, {
                    fileName: "app/routes/city-search.tsx",
                    lineNumber: 75,
                    columnNumber: 17
                  }, this) : null,
                  (cities.data || []).map((city) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Combobox.Option, {
                    className: ({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-teal-600 text-white" : "text-gray-900"}`,
                    value: city,
                    children: ({ selected: selected2, active }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, {
                      children: [
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                          className: `block truncate ${selected2 ? "font-medium" : "font-normal"}`,
                          children: `${city == null ? void 0 : city.name}, ${city == null ? void 0 : city.regionCode}, ${city == null ? void 0 : city.countryCode}`
                        }, void 0, !1, {
                          fileName: "app/routes/city-search.tsx",
                          lineNumber: 91,
                          columnNumber: 25
                        }, this),
                        selected2 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                          className: `absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"}`,
                          children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_solid.CheckIcon, {
                            className: "h-5 w-5",
                            "aria-hidden": "true"
                          }, void 0, !1, {
                            fileName: "app/routes/city-search.tsx",
                            lineNumber: 104,
                            columnNumber: 29
                          }, this)
                        }, void 0, !1, {
                          fileName: "app/routes/city-search.tsx",
                          lineNumber: 99,
                          columnNumber: 27
                        }, this) : null
                      ]
                    }, void 0, !0, {
                      fileName: "app/routes/city-search.tsx",
                      lineNumber: 90,
                      columnNumber: 23
                    }, this)
                  }, city.id, !1, {
                    fileName: "app/routes/city-search.tsx",
                    lineNumber: 80,
                    columnNumber: 19
                  }, this))
                ]
              }, void 0, !0, {
                fileName: "app/routes/city-search.tsx",
                lineNumber: 68,
                columnNumber: 13
              }, this)
            }, void 0, !1, {
              fileName: "app/routes/city-search.tsx",
              lineNumber: 61,
              columnNumber: 11
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/city-search.tsx",
          lineNumber: 45,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/city-search.tsx",
        lineNumber: 44,
        columnNumber: 7
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/city-search.tsx",
      lineNumber: 43,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/city-search.tsx",
    lineNumber: 42,
    columnNumber: 5
  }, this);
}

// app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader3
});
async function loader3({ request }) {
  let host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    let url = new URL("/", `http://${host}`);
    return await Promise.all([
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]), new Response("OK");
  } catch (error) {
    return console.log("healthcheck \u274C", { error }), new Response("ERROR", { status: 500 });
  }
}

// app/routes/api/cities.tsx
var cities_exports = {};
__export(cities_exports, {
  loader: () => loader4
});
var import_node5 = require("@remix-run/node"), searchCities = async (query) => {
  if (!query || query.length < 3)
    return [];
  let url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`, options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "6c9660e30cmshaf19ebf9e32a74fp12e607jsn10dcc6504eb3",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
    }
  };
  try {
    return (await (await fetch(url, options)).json()).data || [];
  } catch (e) {
    return { error: e };
  }
}, loader4 = async (req) => {
  let url = new URL(req.request.url);
  return (0, import_node5.json)(
    await searchCities(url.searchParams.get("q"))
  );
};

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action,
  loader: () => loader5
});
var import_node6 = require("@remix-run/node");
var action = async ({ request }) => logout(request);
async function loader5() {
  return (0, import_node6.redirect)("/");
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react10 = require("@remix-run/react");

// app/utils.ts
var import_react8 = require("react"), import_react9 = require("@remix-run/react");
function useMatchesData(id) {
  let matchingRoutes = (0, import_react9.useMatches)(), route = (0, import_react8.useMemo)(
    () => matchingRoutes.find((route2) => route2.id === id),
    [matchingRoutes, id]
  );
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user == "object";
}
function useOptionalUser() {
  let data = useMatchesData("root");
  if (!(!data || !isUser(data.user)))
    return data.user;
}
function useUser() {
  let maybeUser = useOptionalUser();
  if (!maybeUser)
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  return maybeUser;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/routes/index.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function Index() {
  let user = useOptionalUser();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
    className: "relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "relative sm:pb-16 sm:pt-8",
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "mx-auto max-w-7xl sm:px-6 lg:px-8",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "relative shadow-xl sm:overflow-hidden sm:rounded-2xl",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "absolute inset-0",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
                    className: "h-full w-full object-cover",
                    src: "https://user-images.githubusercontent.com/8431042/161311608-f5d43ab2-85b4-40c5-9dea-065985e5adf5.jpeg",
                    alt: "BTS playing on stage with the group leaving in action poses"
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 12,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "absolute inset-0 bg-[color:rgba(139,92,246,0.5)] mix-blend-multiply"
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 17,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/index.tsx",
                lineNumber: 11,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
                    className: "text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                      className: "block uppercase text-violet-500 drop-shadow-md",
                      children: "K-Pop Stack"
                    }, void 0, !1, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 21,
                      columnNumber: 17
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 20,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
                    className: "mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl",
                    children: "Check the README.md file for instructions on how to get this project deployed."
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 25,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center",
                    children: user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react10.Link, {
                      to: "/notes",
                      className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-violet-700 shadow-sm hover:bg-violet-50 sm:px-8",
                      children: [
                        "View Notes for ",
                        user.email
                      ]
                    }, void 0, !0, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 31,
                      columnNumber: 19
                    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                      className: "space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react10.Link, {
                          to: "/join",
                          className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-violet-700 shadow-sm hover:bg-violet-50 sm:px-8",
                          children: "Sign up"
                        }, void 0, !1, {
                          fileName: "app/routes/index.tsx",
                          lineNumber: 39,
                          columnNumber: 21
                        }, this),
                        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react10.Link, {
                          to: "/login",
                          className: "flex items-center justify-center rounded-md bg-violet-500 px-4 py-3 font-medium text-white hover:bg-violet-600  ",
                          children: "Log In"
                        }, void 0, !1, {
                          fileName: "app/routes/index.tsx",
                          lineNumber: 45,
                          columnNumber: 21
                        }, this)
                      ]
                    }, void 0, !0, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 38,
                      columnNumber: 19
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 29,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
                    href: "https://remix.run",
                    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
                      src: "https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg",
                      alt: "Remix",
                      className: "mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                    }, void 0, !1, {
                      fileName: "app/routes/index.tsx",
                      lineNumber: 55,
                      columnNumber: 17
                    }, this)
                  }, void 0, !1, {
                    fileName: "app/routes/index.tsx",
                    lineNumber: 54,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/index.tsx",
                lineNumber: 19,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/index.tsx",
            lineNumber: 10,
            columnNumber: 11
          }, this)
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 9,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
          className: "mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "mt-6 flex flex-wrap justify-center gap-8",
            children: [
              {
                src: "https://user-images.githubusercontent.com/8431042/161311102-fad29f2b-ffd4-4a24-aa4e-92f3fda526a7.svg",
                alt: "Netlify",
                href: "https://netlify.com"
              },
              {
                src: "https://user-images.githubusercontent.com/8431042/158711352-746c52cf-433e-4823-987a-c9d6f4349ce7.svg",
                alt: "Supabase",
                href: "https://supabase.com"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
                alt: "Tailwind",
                href: "https://tailwindcss.com"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
                alt: "Cypress",
                href: "https://www.cypress.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                alt: "Testing Library",
                href: "https://testing-library.com"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                alt: "Prettier",
                href: "https://prettier.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                alt: "ESLint",
                href: "https://eslint.org"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                alt: "TypeScript",
                href: "https://typescriptlang.org"
              }
            ].map((img) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
              href: img.href,
              className: "flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0",
              children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
                alt: img.alt,
                src: img.src
              }, void 0, !1, {
                fileName: "app/routes/index.tsx",
                lineNumber: 114,
                columnNumber: 17
              }, this)
            }, img.href, !1, {
              fileName: "app/routes/index.tsx",
              lineNumber: 109,
              columnNumber: 15
            }, this))
          }, void 0, !1, {
            fileName: "app/routes/index.tsx",
            lineNumber: 66,
            columnNumber: 11
          }, this)
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 65,
          columnNumber: 9
        }, this)
      ]
    }, void 0, !0, {
      fileName: "app/routes/index.tsx",
      lineNumber: 8,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/index.tsx",
    lineNumber: 7,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action2,
  default: () => Login,
  loader: () => loader6,
  meta: () => meta2
});
var import_react11 = __toESM(require("react")), import_node7 = require("@remix-run/node"), import_react12 = require("@remix-run/react");
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), meta2 = () => ({
  title: "Login"
});
async function loader6({ request }) {
  return await getUserId(request) ? (0, import_node7.redirect)("/") : (0, import_node7.json)({});
}
var action2 = async ({ request }) => {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = formData.get("redirectTo"), remember = formData.get("remember");
  if (!validateEmail(email))
    return (0, import_node7.json)({ errors: { email: "Email is invalid." } }, { status: 400 });
  if (typeof password != "string")
    return (0, import_node7.json)(
      { errors: { password: "Valid password is required." } },
      { status: 400 }
    );
  if (password.length < 6)
    return (0, import_node7.json)(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo: typeof redirectTo == "string" ? redirectTo : "/notes"
  }) : (0, import_node7.json)(
    { errors: { email: "Invalid email or password" } },
    { status: 400 }
  );
};
function Login() {
  var _a, _b, _c, _d, _e, _f;
  let [searchParams] = (0, import_react12.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? "/notes", actionData = (0, import_react12.useActionData)(), emailRef = import_react11.default.useRef(null), passwordRef = import_react11.default.useRef(null);
  return import_react11.default.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email && ((_b2 = emailRef == null ? void 0 : emailRef.current) == null || _b2.focus()), (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef == null ? void 0 : passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full flex-col justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "mx-auto w-full max-w-md px-8",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react12.Form, {
        method: "post",
        className: "space-y-6",
        noValidate: !0,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                className: "text-sm font-medium",
                htmlFor: "email",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block text-gray-700",
                    children: "Email Address"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 98,
                    columnNumber: 15
                  }, this),
                  ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block pt-1 text-red-700",
                    id: "email-error",
                    children: (_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 100,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 97,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                className: "w-full rounded border border-gray-500 px-2 py-1 text-lg",
                autoComplete: "email",
                type: "email",
                name: "email",
                id: "email",
                "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.email ? !0 : void 0,
                "aria-describedby": "email-error",
                ref: emailRef
              }, void 0, !1, {
                fileName: "app/routes/login.tsx",
                lineNumber: 105,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 96,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                className: "text-sm font-medium",
                htmlFor: "password",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block text-gray-700",
                    children: "Password"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 118,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block font-light text-gray-700",
                    children: "Must have at least 6 characters."
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 119,
                    columnNumber: 15
                  }, this),
                  ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "pt-1 text-red-700",
                    id: "password-error",
                    children: (_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.password
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 123,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 117,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                id: "password",
                type: "password",
                name: "password",
                autoComplete: "",
                className: "w-full rounded border border-gray-500 px-2 py-1 text-lg",
                "aria-invalid": (_f = actionData == null ? void 0 : actionData.errors) != null && _f.password ? !0 : void 0,
                "aria-describedby": "password-error",
                ref: passwordRef
              }, void 0, !1, {
                fileName: "app/routes/login.tsx",
                lineNumber: 128,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 116,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
            className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
            type: "submit",
            children: "Log in"
          }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 139,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
            type: "hidden",
            name: "redirectTo",
            value: redirectTo
          }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 145,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex items-center justify-between",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "flex items-center",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                    id: "remember",
                    name: "remember",
                    type: "checkbox"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 148,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                    className: "ml-2 block text-sm text-gray-900",
                    htmlFor: "remember",
                    children: "Remember me"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 154,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 147,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "text-center text-sm text-gray-500",
                children: [
                  "Don't have an account?",
                  " ",
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react12.Link, {
                    className: "text-blue-500 underline",
                    to: { pathname: "/join" },
                    children: "Sign up"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 163,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 161,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 146,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/login.tsx",
      lineNumber: 94,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 93,
    columnNumber: 5
  }, this);
}

// app/routes/notes.tsx
var notes_exports = {};
__export(notes_exports, {
  default: () => NotesPage,
  loader: () => loader7
});
var import_node8 = require("@remix-run/node"), import_react13 = require("@remix-run/react");

// app/models/note.server.ts
async function getNoteListItems({ userId }) {
  let { data } = await supabase.from("notes").select("id, title").eq("profile_id", userId);
  return data;
}
async function createNote({
  title,
  body,
  userId
}) {
  let resp = await supabase.from("notes").insert([{ title, body, profile_id: userId }]).select().single();
  return console.log("created a note: ", resp), resp.error ? null : resp.data;
}
async function deleteNote({
  id,
  userId
}) {
  let { error } = await supabase.from("notes").delete().match({ id, profile_id: userId });
  return error ? null : {};
}
async function getNote({
  id,
  userId
}) {
  let { data, error } = await supabase.from("notes").select("*").eq("profile_id", userId).eq("id", id).single();
  return error ? null : {
    userId: data.profile_id,
    id: data.id,
    title: data.title,
    body: data.body
  };
}

// app/routes/notes.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader7({ request }) {
  let userId = await requireUserId(request), noteListItems = await getNoteListItems({ userId });
  return (0, import_node8.json)({ noteListItems });
}
function NotesPage() {
  let data = (0, import_react13.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex h-full min-h-screen flex-col",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, !1, {
        fileName: "app/routes/notes.tsx",
        lineNumber: 24,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
        className: "flex h-full bg-white",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "h-full w-80 border-r bg-gray-50",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Link, {
                to: "new",
                className: "block p-4 text-xl text-blue-500",
                children: "+ New Note"
              }, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 27,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {}, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 31,
                columnNumber: 11
              }, this),
              data.noteListItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
                className: "p-4",
                children: "No notes yet"
              }, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 34,
                columnNumber: 13
              }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
                children: data.noteListItems.map((note) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.NavLink, {
                    className: ({ isActive }) => `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`,
                    to: note.id,
                    children: [
                      "\u{1F4DD} ",
                      note.title
                    ]
                  }, void 0, !0, {
                    fileName: "app/routes/notes.tsx",
                    lineNumber: 39,
                    columnNumber: 19
                  }, this)
                }, note.id, !1, {
                  fileName: "app/routes/notes.tsx",
                  lineNumber: 38,
                  columnNumber: 17
                }, this))
              }, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 36,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 26,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex-1 p-6",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Outlet, {}, void 0, !1, {
              fileName: "app/routes/notes.tsx",
              lineNumber: 54,
              columnNumber: 11
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 53,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/notes.tsx",
        lineNumber: 25,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/notes.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}
function Header() {
  let user = useUser();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
    className: "flex items-center justify-between bg-slate-800 p-4 text-white",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
        className: "text-3xl font-bold",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Link, {
          to: ".",
          children: "Notes"
        }, void 0, !1, {
          fileName: "app/routes/notes.tsx",
          lineNumber: 66,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/notes.tsx",
        lineNumber: 65,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
        children: user.email
      }, void 0, !1, {
        fileName: "app/routes/notes.tsx",
        lineNumber: 68,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Form, {
        action: "/logout",
        method: "post",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
          type: "submit",
          className: "rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600",
          children: "Logout"
        }, void 0, !1, {
          fileName: "app/routes/notes.tsx",
          lineNumber: 70,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/notes.tsx",
        lineNumber: 69,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/notes.tsx",
    lineNumber: 64,
    columnNumber: 5
  }, this);
}

// app/routes/notes/$noteId.tsx
var noteId_exports = {};
__export(noteId_exports, {
  action: () => action3,
  default: () => NoteDetailsPage,
  loader: () => loader8
});
var import_node9 = require("@remix-run/node"), import_react14 = require("@remix-run/react");
var import_tiny_invariant3 = __toESM(require("tiny-invariant")), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader8({ request, params }) {
  let userId = await requireUserId(request);
  (0, import_tiny_invariant3.default)(params.noteId, "noteId not found");
  let note = await getNote({ userId, id: params.noteId });
  if (!note)
    throw new Response("Not Found", { status: 404 });
  return (0, import_node9.json)({ note });
}
var action3 = async ({ request, params }) => {
  let userId = await requireUserId(request);
  return (0, import_tiny_invariant3.default)(params.noteId, "noteId not found"), await deleteNote({ userId, id: params.noteId }), (0, import_node9.redirect)("/notes");
};
function NoteDetailsPage() {
  let data = (0, import_react14.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
        className: "text-2xl font-bold",
        children: data.note.title
      }, void 0, !1, {
        fileName: "app/routes/notes/$noteId.tsx",
        lineNumber: 39,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
        className: "py-6",
        children: data.note.body
      }, void 0, !1, {
        fileName: "app/routes/notes/$noteId.tsx",
        lineNumber: 40,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {
        className: "my-4"
      }, void 0, !1, {
        fileName: "app/routes/notes/$noteId.tsx",
        lineNumber: 41,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react14.Form, {
        method: "post",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
          type: "submit",
          className: "rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
          children: "Delete"
        }, void 0, !1, {
          fileName: "app/routes/notes/$noteId.tsx",
          lineNumber: 43,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/notes/$noteId.tsx",
        lineNumber: 42,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/notes/$noteId.tsx",
    lineNumber: 38,
    columnNumber: 5
  }, this);
}

// app/routes/notes/index.tsx
var notes_exports2 = {};
__export(notes_exports2, {
  default: () => NoteIndexPage
});
var import_react15 = require("@remix-run/react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function NoteIndexPage() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
    children: [
      "No note selected. Select a note on the left, or",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react15.Link, {
        to: "new",
        className: "text-blue-500 underline",
        children: "create a new note."
      }, void 0, !1, {
        fileName: "app/routes/notes/index.tsx",
        lineNumber: 7,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/notes/index.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/routes/notes/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action4,
  default: () => NewNotePage
});
var import_node10 = require("@remix-run/node"), import_react16 = require("@remix-run/react");
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), action4 = async ({ request }) => {
  let userId = await requireUserId(request), formData = await request.formData(), title = formData.get("title"), body = formData.get("body");
  return typeof title != "string" || title.length === 0 ? (0, import_node10.json)({ errors: { title: "Title is required" } }, { status: 400 }) : typeof body != "string" || body.length === 0 ? (0, import_node10.json)({ errors: { body: "Body is required" } }, { status: 400 }) : (await createNote({ title, body, userId }), (0, import_node10.redirect)("/notes"));
};
function NewNotePage() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react16.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    },
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
          className: "flex w-full flex-col gap-1",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
              children: "Title: "
            }, void 0, !1, {
              fileName: "app/routes/notes/new.tsx",
              lineNumber: 39,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
              name: "title",
              className: "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            }, void 0, !1, {
              fileName: "app/routes/notes/new.tsx",
              lineNumber: 40,
              columnNumber: 11
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/notes/new.tsx",
          lineNumber: 38,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/notes/new.tsx",
        lineNumber: 37,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
          className: "flex w-full flex-col gap-1",
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
              children: "Body: "
            }, void 0, !1, {
              fileName: "app/routes/notes/new.tsx",
              lineNumber: 48,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
              name: "body",
              rows: 8,
              className: "w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            }, void 0, !1, {
              fileName: "app/routes/notes/new.tsx",
              lineNumber: 49,
              columnNumber: 11
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/notes/new.tsx",
          lineNumber: 47,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/notes/new.tsx",
        lineNumber: 46,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "text-right",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
          type: "submit",
          className: "rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
          children: "Save"
        }, void 0, !1, {
          fileName: "app/routes/notes/new.tsx",
          lineNumber: 58,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/notes/new.tsx",
        lineNumber: 57,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/notes/new.tsx",
    lineNumber: 28,
    columnNumber: 5
  }, this);
}

// app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action5,
  default: () => Join,
  loader: () => loader9,
  meta: () => meta3
});
var import_node11 = require("@remix-run/node"), import_react17 = require("@remix-run/react");
var React2 = __toESM(require("react")), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), meta3 = () => ({
  title: "Sign Up"
});
async function loader9({ request }) {
  return await getUserId(request) ? (0, import_node11.redirect)("/") : (0, import_node11.json)({});
}
var action5 = async ({ request }) => {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = formData.get("redirectTo");
  if (!validateEmail(email))
    return (0, import_node11.json)(
      { errors: { email: "Email is invalid." } },
      { status: 400 }
    );
  if (typeof password != "string")
    return (0, import_node11.json)(
      { errors: { password: "Valid password is required." } },
      { status: 400 }
    );
  if (password.length < 6)
    return (0, import_node11.json)(
      { errors: { password: "Password is too short." } },
      { status: 400 }
    );
  if (await getProfileByEmail(email))
    return (0, import_node11.json)(
      { errors: { email: "A user already exists with this email." } },
      { status: 400 }
    );
  let user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: !1,
    redirectTo: typeof redirectTo == "string" ? redirectTo : "/"
  });
};
function Join() {
  var _a, _b, _c, _d, _e, _f;
  let [searchParams] = (0, import_react17.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? void 0, actionData = (0, import_react17.useActionData)(), emailRef = React2.useRef(null), passwordRef = React2.useRef(null);
  return React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email && ((_b2 = emailRef == null ? void 0 : emailRef.current) == null || _b2.focus()), (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef == null ? void 0 : passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full flex-col justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "mx-auto w-full max-w-md px-8",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react17.Form, {
        className: "space-y-6",
        method: "post",
        noValidate: !0,
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                className: "text-sm font-medium",
                htmlFor: "email",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block text-gray-700",
                    children: "Email Address"
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 106,
                    columnNumber: 15
                  }, this),
                  ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block pt-1 text-red-700",
                    id: "email-error",
                    children: (_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 108,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/join.tsx",
                lineNumber: 105,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                className: "w-full rounded border border-gray-500 px-2 py-1 text-lg",
                type: "email",
                name: "email",
                id: "email",
                required: !0,
                "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.email ? !0 : void 0,
                "aria-describedby": "email-error",
                ref: emailRef
              }, void 0, !1, {
                fileName: "app/routes/join.tsx",
                lineNumber: 113,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/join.tsx",
            lineNumber: 104,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                className: "text-sm font-medium",
                htmlFor: "password",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block text-gray-700",
                    children: "Password"
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 126,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "block font-light text-gray-700",
                    children: "Must have at least 6 characters."
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 127,
                    columnNumber: 15
                  }, this),
                  ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                    className: "pt-1 text-red-700",
                    id: "password-error",
                    children: (_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.password
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 131,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/join.tsx",
                lineNumber: 125,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                id: "password",
                type: "password",
                name: "password",
                className: "w-full rounded border border-gray-500 px-2 py-1 text-lg",
                autoComplete: "new-password",
                "aria-invalid": (_f = actionData == null ? void 0 : actionData.errors) != null && _f.password ? !0 : void 0,
                "aria-describedby": "password-error",
                ref: passwordRef
              }, void 0, !1, {
                fileName: "app/routes/join.tsx",
                lineNumber: 136,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/join.tsx",
            lineNumber: 124,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
            className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
            type: "submit",
            children: "Create Account"
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 147,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
            type: "hidden",
            name: "redirectTo",
            value: redirectTo
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 153,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex items-center justify-center",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "text-center text-sm text-gray-500",
              children: [
                "Already have an account?",
                " ",
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react17.Link, {
                  className: "text-blue-500 underline",
                  to: {
                    pathname: "/login",
                    search: searchParams.toString()
                  },
                  children: "Log in"
                }, void 0, !1, {
                  fileName: "app/routes/join.tsx",
                  lineNumber: 157,
                  columnNumber: 15
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/join.tsx",
              lineNumber: 155,
              columnNumber: 13
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 154,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/join.tsx",
        lineNumber: 103,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/join.tsx",
      lineNumber: 102,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/join.tsx",
    lineNumber: 101,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "8837d664", entry: { module: "/build/entry.client-XIVYXLVX.js", imports: ["/build/_shared/chunk-4IZGYSXB.js", "/build/_shared/chunk-5KL4PAQL.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-4V2NEQZG.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/api/cities": { id: "routes/api/cities", parentId: "root", path: "api/cities", index: void 0, caseSensitive: void 0, module: "/build/routes/api/cities-RTNMYYIW.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/api/enneagram": { id: "routes/api/enneagram", parentId: "root", path: "api/enneagram", index: void 0, caseSensitive: void 0, module: "/build/routes/api/enneagram-EQ4FQNB6.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/birth-chart": { id: "routes/birth-chart", parentId: "root", path: "birth-chart", index: void 0, caseSensitive: void 0, module: "/build/routes/birth-chart-JS3RJHUC.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/city-search": { id: "routes/city-search", parentId: "root", path: "city-search", index: void 0, caseSensitive: void 0, module: "/build/routes/city-search-YUSETNYS.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/healthcheck": { id: "routes/healthcheck", parentId: "root", path: "healthcheck", index: void 0, caseSensitive: void 0, module: "/build/routes/healthcheck-QB3PEZAZ.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-PMXKKELT.js", imports: ["/build/_shared/chunk-HA6LBXYV.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/join": { id: "routes/join", parentId: "root", path: "join", index: void 0, caseSensitive: void 0, module: "/build/routes/join-KXULISZG.js", imports: ["/build/_shared/chunk-M2ND3YFM.js", "/build/_shared/chunk-HA6LBXYV.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-UCFS4UKX.js", imports: ["/build/_shared/chunk-M2ND3YFM.js", "/build/_shared/chunk-HA6LBXYV.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-DOMDNNGV.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes": { id: "routes/notes", parentId: "root", path: "notes", index: void 0, caseSensitive: void 0, module: "/build/routes/notes-ADIMW252.js", imports: ["/build/_shared/chunk-E4QSSUG6.js", "/build/_shared/chunk-HA6LBXYV.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes/$noteId": { id: "routes/notes/$noteId", parentId: "routes/notes", path: ":noteId", index: void 0, caseSensitive: void 0, module: "/build/routes/notes/$noteId-TFSMKHRE.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes/index": { id: "routes/notes/index", parentId: "routes/notes", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/notes/index-TQMU3WHC.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes/new": { id: "routes/notes/new", parentId: "routes/notes", path: "new", index: void 0, caseSensitive: void 0, module: "/build/routes/notes/new-GOTGO2LB.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-8837D664.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/api/enneagram": {
    id: "routes/api/enneagram",
    parentId: "root",
    path: "api/enneagram",
    index: void 0,
    caseSensitive: void 0,
    module: enneagram_exports
  },
  "routes/birth-chart": {
    id: "routes/birth-chart",
    parentId: "root",
    path: "birth-chart",
    index: void 0,
    caseSensitive: void 0,
    module: birth_chart_exports
  },
  "routes/city-search": {
    id: "routes/city-search",
    parentId: "root",
    path: "city-search",
    index: void 0,
    caseSensitive: void 0,
    module: city_search_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/api/cities": {
    id: "routes/api/cities",
    parentId: "root",
    path: "api/cities",
    index: void 0,
    caseSensitive: void 0,
    module: cities_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/notes": {
    id: "routes/notes",
    parentId: "root",
    path: "notes",
    index: void 0,
    caseSensitive: void 0,
    module: notes_exports
  },
  "routes/notes/$noteId": {
    id: "routes/notes/$noteId",
    parentId: "routes/notes",
    path: ":noteId",
    index: void 0,
    caseSensitive: void 0,
    module: noteId_exports
  },
  "routes/notes/index": {
    id: "routes/notes/index",
    parentId: "routes/notes",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: notes_exports2
  },
  "routes/notes/new": {
    id: "routes/notes/new",
    parentId: "routes/notes",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
