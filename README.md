kód na merge : Domov.tsx
nekopíruj náhlad lebo ti to nepôojde

export default function DomovPage() {
    return (
        <div className="p-10 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">
                Vitajte v systéme OcuNet 🕵️👁️
            </h1>

            <p className="text-gray-700 text-lg mb-3 leading-relaxed">
                Nachádzate sa na úvodnej stránke systému OcuNet. Tu nájdete stručný popis, ktorý Vám pomôže s orientáciou v aplikácií
                Nižšie sú uvedené časti a funkcie, ktoré môžete v systéme nájsť a používať.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Aplikácie</h2>
            <ul className="list-none mb-8">
                {/* Položka Fotky */}
                <li className="mb-6"> {/* Väčší spodný okraj pre celú položku */}
                    <ul className="list-none mb-2">
                        {/* Položka Fotky */}
                        <li className="mb-6"> {/* Väčší spodný okraj pre celú položku */}
                            <h4 className="text-xl font-medium text-gray-800 mb-1">Fotky</h4>
                            <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                                <li className="mb-1">
                                    <span className="font-semibold">Priestor na nahratie fotky oka:</span> Tu môžete priamo nahrať digitálne snímky oka.
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Výber informácií o fotke:</span>
                                    {/* Tu je vnorený zoznam pre tri body, ktoré boli na obrázku */}
                                    <ul className="list-disc list-inside text-gray-600 text-base ml-4 mt-1"> {/* list-disc pre bodky ako na obrázku */}
                                        <li className="mb-1">Výber konkrétneho pacienta z databázy.</li>
                                        <li className="mb-1">Určenie oka (pravé alebo ľavé).</li>
                                        <li>Priestor na prípadné poznámky k fotke.</li>
                                    </ul>
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Tlačidlo na uloženie/reset:</span> Uložte informácie do systému alebo resetujte formulár.
                                </li>
                            </ul>
                        </li>

                        {/* Položka Analýza */}
                        <li className="mb-4">
                            <h4 className="text-xl font-medium text-gray-800 mb-2">Analýza</h4>
                            <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                                <li className="mb-1">
                                    <span className="font-semibold">Výber pacienta:</span> Tu môžete vybrať pacienta z databázy. Zobrazia sa inormácie o pacientovy a k nemu priradené fotografie.
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Galéria fotografií a výber fotky:</span> Sú tu zobrazené fotografie. Fotografie je možné zoradiť alebo filtrovať. Následne je možné zvoliť fotgrafiu na analýzu.
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Výber metódy analýzy</span> Tu je možné vybrať akým spôsobom sa bude fotografia anlyzovať. Tlačidlo na odoslanie fotografie/í na zvolenú analýzu.
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>

            {/* Nadpis pre kategóriu Používatelia */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Používatelia</h2>
            <ul className="list-none mb-4">
                {/* Položka Admini */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Admini</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Admini majú prístup ku vštkým dátam bez výnimky
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho admina
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Admina:</span> tlačidlom je možné zaregistrovať nového člena admin tímu.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam adminov:</span> Zoznam obsahuje údaje o všetkých adminoch.
                        </li>
                    </ul>
                </li>

                {/* Položka Doktori */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Doktori</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Doktory posudzujú diagnózy pacientov. Každý doktor má svojich pacientov
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho doktora
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Doktora:</span> tlačidlom je možné zaregistrovať nového doktora.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam doktorov:</span> Zoznam obsahuje údaje o všetkých lekároch ako napríkad počet pacientov.
                        </li>
                    </ul>
                </li>

                {/* Položka Technici */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-2">Technici</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Technici sa starajú o nahrávanie fotografií očí pacientov.
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho technika
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Technika:</span> tlačidlom je možné zaregistrovať nového technika.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam adminov:</span> Zoznam obsahuje údaje o všetkých technikov. Zobrazená je aj informácia o aktivite technikov.
                        </li>
                    </ul>
                </li>

                {/* Položka Pacienti */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-2">Pacienti</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Pacient má pridelené svoje fotografie v systéme. Tie sú posudzované analýzami, ale aj doktorom.
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho pacienta
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Pacienta:</span> tlačidlom je možné zaregistrovať nového pacienta.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam pacientov:</span> Zoznam obsahuje údaje o všetkých pacientoch. Zobrazená je aj informácia o počte fotografií, ktoré má daný pacient nahraté v systéme.
                        </li>
                    </ul>
                </li>
            </ul>

            {/* Nadpis pre kategóriu Systém */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Systém</h2>
            <ul className="list-none mb-8">
                {/* Položka Nastavenia */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-2">Nastavenia (Optional)</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-8">
                            V prípade problémov s niektorými komponentami kontaktujte admin tím.
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">-</span>
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">-</span>
                        </li>
                        <li>
                            <span className="font-semibold">-</span>
                        </li>
                    </ul>
                </li>
            </ul>

            <p className="text-gray-600 text-base mt-8">
                V prípade problémov s niektorými komponentami kontaktujte admin tím.
            </p>
        </div>
    )
}
