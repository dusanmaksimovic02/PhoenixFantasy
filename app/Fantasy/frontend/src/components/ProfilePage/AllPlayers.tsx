import type { Player } from "../../models/Player";
import { getPlayers } from "../../services/StatsService";
import { useQuery } from "@tanstack/react-query";
import { useState, type FC } from "react";
import UploadPlayerImage from "./UploadPlayerImage";

const AllPlayers: FC = () => {
  const [photoUpdateKey, setPhotoUpdateKey] = useState<number>(Date.now());

  const { data: allPlayers } = useQuery({
    queryKey: ["allPlayers"],
    queryFn: getPlayers,
  });
  return (
    <div>
      <h3 className="mb-8 text-center text-phoenix">All Players</h3>
      <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
        <table className="table w-full bg-white dark:bg-neutral-800">
          <thead className="bg-neutral-200 text-neutral-700 dark:text-neutral-50 dark:bg-neutral-900">
            <tr>
              {["Image", "No.", "Player"].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allPlayers &&
              allPlayers.map((p: Player) => (
                <tr
                  key={p.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-nowrap"
                >
                  <td className="flex items-center justify-between gap-2">
                    <div className="w-15 h-25 overflow-hidden text-wrap">
                      <img
                        src={`/images/players/${p.id}.webp?=${photoUpdateKey}`}
                        alt={`${p.firstName} ${p.lastName} photo`}
                      />
                    </div>
                    <UploadPlayerImage
                      playerId={p.id}
                      onUploadSuccess={() => setPhotoUpdateKey(Date.now())}
                    />
                  </td>
                  <td>#{p.jerseyNumber}</td>
                  <td>
                    {p.firstName} {p.lastName}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPlayers;
